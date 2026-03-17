// Lightweight in-memory database using plain JS objects.
// Perfect for demo purposes – no MongoDB required.
import bcrypt from "bcryptjs";

const db = {
  departments: [],
  roles: [],
  users: [],
  providers: [],
  policies: [],
  accessLogs: [],
  authLogs: [],
  auditLogs: [],
  reports: [],
  settings: null,
  _idCounter: 1,
};

function newId() {
  return String(db._idCounter++).padStart(24, "0");
}

export function connectDB() {
  console.log("In-memory database ready.");
}

// ─── Generic CRUD helpers ────────────────────────────────────────────────────

function makeModel(collectionName) {
  return {
    _col: () => db[collectionName],

    async find(query = {}) {
      let results = db[collectionName];
      for (const [k, v] of Object.entries(query)) {
        results = results.filter((doc) => {
          if (v && typeof v === "object" && !Array.isArray(v)) {
            // regex support
            if (v instanceof RegExp) return v.test(doc[k]);
          }
          return doc[k] === v;
        });
      }
      return {
        populate: () => ({ populate: () => Promise.resolve(results) }),
        lean: () => Promise.resolve(results),
        sort: () => ({
          limit: () => ({
            populate: () => Promise.resolve(results),
            lean: () => Promise.resolve(results),
          }),
          lean: () => Promise.resolve(results),
          populate: () => ({
            lean: () => Promise.resolve(results),
          }),
        }),
        exec: () => Promise.resolve(results),
        then: (res, rej) => Promise.resolve(results).then(res, rej),
        [Symbol.iterator]: () => results[Symbol.iterator](),
      };
    },

    async findById(id) {
      const doc = db[collectionName].find((d) => d._id === id);
      if (!doc) return null;
      // add populate stub
      doc.populate = () => Promise.resolve(doc);
      return doc;
    },

    async findOne(query = {}) {
      const results = await this.find(query);
      const arr = Array.isArray(results) ? results : await results;
      const all = db[collectionName];
      for (const doc of all) {
        let match = true;
        for (const [k, v] of Object.entries(query)) {
          if (v instanceof RegExp) {
            if (!v.test(doc[k])) { match = false; break; }
          } else if (doc[k] !== v) {
            match = false; break;
          }
        }
        if (match) return doc;
      }
      return null;
    },

    async findByIdAndUpdate(id, update, opts = {}) {
      const idx = db[collectionName].findIndex((d) => d._id === id);
      if (idx === -1) return null;
      const data = update.$set || update;
      db[collectionName][idx] = { ...db[collectionName][idx], ...data };
      return db[collectionName][idx];
    },

    async findByIdAndDelete(id) {
      const idx = db[collectionName].findIndex((d) => d._id === id);
      if (idx === -1) return null;
      const [removed] = db[collectionName].splice(idx, 1);
      return removed;
    },

    async insertMany(docs) {
      const inserted = docs.map((d) => {
        const doc = { _id: newId(), ...d };
        db[collectionName].push(doc);
        return doc;
      });
      return inserted;
    },

    async deleteMany() {
      db[collectionName] = [];
    },

    async create(data) {
      if (Array.isArray(data)) return this.insertMany(data);
      const doc = { _id: newId(), ...data };
      db[collectionName].push(doc);
      return doc;
    },

    async save() { return this; },

    async countDocuments() { return db[collectionName].length; },
  };
}

// ─── Models ──────────────────────────────────────────────────────────────────

const Department  = makeModel("departments");
const Role        = makeModel("roles");
const User        = makeModel("users");
const IdentityProvider = makeModel("providers");
const ZscalerPolicy    = makeModel("policies");
const AccessLog   = makeModel("accessLogs");
const AuthLog     = makeModel("authLogs");
const AuditLog    = makeModel("auditLogs");
const Report      = makeModel("reports");

// Settings is a singleton
const Setting = {
  async findOne() { return db.settings; },
  async create(data) { db.settings = { _id: newId(), ...data }; return db.settings; },
  async findOneAndUpdate(q, update, opts) {
    const data = update.$set || update;
    db.settings = { ...db.settings, ...data };
    return db.settings;
  },
  async deleteMany() { db.settings = null; },
};

export { Department, Role, User, IdentityProvider, ZscalerPolicy, AccessLog, AuthLog, AuditLog, Report, Setting, db };
