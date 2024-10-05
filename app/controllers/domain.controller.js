const { where } = require("sequelize");
const db = require("../models");
const Domain = db.domains;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  const purchaseDate = new Date(req.body.date_of_purchase);
  const expirationYears = parseInt(req.body.expiration_date, 10);
  const expirationDate = new Date(purchaseDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + expirationYears);

  const today = new Date();

  let status = "inactive";
  if (expirationDate > today) {
    status = "active";
  }

  const domain = {
    domain: req.body.domain,
    link_domain: req.body.link_domain,
    price: req.body.price,
    currency: req.body.currency,
    account: req.body.account,
    password: req.body.password,
    date_of_purchase: req.body.date_of_purchase,
    expiration_date: req.body.expiration_date,
    key_app: req.body.key_app,
    status: status,
    company: req.body.company,
    manager: req.body.manager,
  };

  Domain.create(domain)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

exports.findAll = async (req, res) => {
  try {
    const domainInfo = await Domain.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(domainInfo);
  } catch (error) {
    res.status(500).send({
      message: "Server Error",
    });
  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  Domain.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Domain was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Domain with id=${id}. Maybe Domain was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Domain with id=" + id,
      });
    });
};

exports.status = async (req, res) => {
  try {
    console.log("Status: ", req.body.status)
    const newStatus = await Domain.update(
      { status: req.body.status },
      { where: { id: req.params.id } }
    );
    if (newStatus[0] === 1) {
      res.status(200).send("Domain status updated successfully");
    } else {
      res.status(404).send("Domain not found or no changes made");
    }
  } catch {
    res.status(500).send("Could not update domain status");
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Domain.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Domain was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Domain with id=${id}. Maybe Domain was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Domain with id=" + id,
      });
    });
};

exports.getDomainDashboard = async (req, res) => {
  
  try {
    const [domainNumber, domainActive, domainInactive, domainRejected] =
      await Promise.all([
        Domain.count({ where: { deletedAt: null } }),
        Domain.count({ where: { status: "active", deletedAt: null } }),
        Domain.count({ where: { status: "inactive", deletedAt: null } }),
        Domain.count({ where: { status: "rejected", deletedAt: null } }),
      ]);

    res.json({ domainNumber, domainActive, domainInactive, domainRejected });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
