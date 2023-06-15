const db = require("../../../config/db");
const { Sequelize } = require("sequelize");
const employeeSchema = require("../schemas/employeeSchema")(
  db.sequelize,
  Sequelize
);
const organizationSchema = require("../schemas/organizationSchema")(
  db.sequelize,
  Sequelize
);

const projectSchema = require("../schemas/projectsSchems")(
  db.sequelize,
  Sequelize
);

const rolesSchema = require("../schemas/roleschema")(db.sequelize, Sequelize);

const projectsRoleSchems = require("../schemas/projectRoleSchema")(
  db.sequelize,
  Sequelize
);

const projectsSchems = require("../schemas/projectsSchems")(
  db.sequelize,
  Sequelize
);

const getAllEmployee = async (id) => {
  return new Promise(async (resolve, reject) => {
    employeeSchema.belongsToMany(projectSchema,{ through:{ model: projectsRoleSchems }, foreignKey: "employeeId"});
    projectSchema.belongsToMany(rolesSchema, { through:{model:projectsRoleSchems}, foreignKey: "projectId"});
    employeeSchema.findAll({
      where: { organizationId: id },
      include: [
        {
          model: projectSchema,
          through: { attributes: [] },
          include: [
            {
              model: rolesSchema,
              through: { attributes: [] },
              attributes: { exclude: ['createdAt', 'updatedAt', 'isRemoved'] }
            }
          ],
          attributes: { exclude: ['createdAt', 'updatedAt', 'isRemoved'] }
        }
        
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'isRemoved', 'organizationId'] }
    })
      .then((employees) => {
        resolve({ employee : employees, isSuccess: true });
      });
  });
};

module.exports = {
  getAllEmployee
};
