var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS(function(exports2) {
  var ALIAS = Symbol.for("yaml.alias");
  var DOC = Symbol.for("yaml.document");
  var MAP = Symbol.for("yaml.map");
  var PAIR = Symbol.for("yaml.pair");
  var SCALAR = Symbol.for("yaml.scalar");
  var SEQ = Symbol.for("yaml.seq");
  var NODE_TYPE = Symbol.for("yaml.node.type");
  var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
  var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
  var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
  var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
  var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
  var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
  function isCollection(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return true;
      }
    return false;
  }
  function isNode(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return true;
      }
    return false;
  }
  var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
  exports2.ALIAS = ALIAS;
  exports2.DOC = DOC;
  exports2.MAP = MAP;
  exports2.NODE_TYPE = NODE_TYPE;
  exports2.PAIR = PAIR;
  exports2.SCALAR = SCALAR;
  exports2.SEQ = SEQ;
  exports2.hasAnchor = hasAnchor;
  exports2.isAlias = isAlias;
  exports2.isCollection = isCollection;
  exports2.isDocument = isDocument;
  exports2.isMap = isMap;
  exports2.isNode = isNode;
  exports2.isPair = isPair;
  exports2.isScalar = isScalar;
  exports2.isSeq = isSeq;
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS(function(exports2) {
  var identity = require_identity();
  var BREAK = Symbol("break visit");
  var SKIP = Symbol("skip children");
  var REMOVE = Symbol("remove node");
  function visit(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
      const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      visit_(null, node, visitor_, Object.freeze([]));
  }
  visit.BREAK = BREAK;
  visit.SKIP = SKIP;
  visit.REMOVE = REMOVE;
  function visit_(key, node, visitor, path) {
    const ctrl = callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visit_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (identity.isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0;i < node.items.length; ++i) {
          const ci = visit_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (identity.isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = visit_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = visit_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
      const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      await visitAsync_(null, node, visitor_, Object.freeze([]));
  }
  visitAsync.BREAK = BREAK;
  visitAsync.SKIP = SKIP;
  visitAsync.REMOVE = REMOVE;
  async function visitAsync_(key, node, visitor, path) {
    const ctrl = await callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (identity.isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0;i < node.items.length; ++i) {
          const ci = await visitAsync_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (identity.isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = await visitAsync_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = await visitAsync_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    }
    return visitor;
  }
  function callVisitor(key, node, visitor, path) {
    if (typeof visitor === "function")
      return visitor(key, node, path);
    if (identity.isMap(node))
      return visitor.Map?.(key, node, path);
    if (identity.isSeq(node))
      return visitor.Seq?.(key, node, path);
    if (identity.isPair(node))
      return visitor.Pair?.(key, node, path);
    if (identity.isScalar(node))
      return visitor.Scalar?.(key, node, path);
    if (identity.isAlias(node))
      return visitor.Alias?.(key, node, path);
    return;
  }
  function replaceNode(key, path, node) {
    const parent = path[path.length - 1];
    if (identity.isCollection(parent)) {
      parent.items[key] = node;
    } else if (identity.isPair(parent)) {
      if (key === "key")
        parent.key = node;
      else
        parent.value = node;
    } else if (identity.isDocument(parent)) {
      parent.contents = node;
    } else {
      const pt = identity.isAlias(parent) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${pt} parent`);
    }
  }
  exports2.visit = visit;
  exports2.visitAsync = visitAsync;
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS(function(exports2) {
  var identity = require_identity();
  var visit = require_visit();
  var escapeChars = {
    "!": "%21",
    ",": "%2C",
    "[": "%5B",
    "]": "%5D",
    "{": "%7B",
    "}": "%7D"
  };
  var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);

  class Directives {
    constructor(yaml, tags) {
      this.docStart = null;
      this.docEnd = false;
      this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
      this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
      const copy = new Directives(this.yaml, this.tags);
      copy.docStart = this.docStart;
      return copy;
    }
    atDocument() {
      const res = new Directives(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = true;
          break;
        case "1.2":
          this.atNextDocument = false;
          this.yaml = {
            explicit: Directives.defaultYaml.explicit,
            version: "1.2"
          };
          this.tags = Object.assign({}, Directives.defaultTags);
          break;
      }
      return res;
    }
    add(line, onError) {
      if (this.atNextDocument) {
        this.yaml = { explicit: Directives.defaultYaml.explicit, version: "1.1" };
        this.tags = Object.assign({}, Directives.defaultTags);
        this.atNextDocument = false;
      }
      const parts = line.trim().split(/[ \t]+/);
      const name = parts.shift();
      switch (name) {
        case "%TAG": {
          if (parts.length !== 2) {
            onError(0, "%TAG directive should contain exactly two parts");
            if (parts.length < 2)
              return false;
          }
          const [handle, prefix] = parts;
          this.tags[handle] = prefix;
          return true;
        }
        case "%YAML": {
          this.yaml.explicit = true;
          if (parts.length !== 1) {
            onError(0, "%YAML directive should contain exactly one part");
            return false;
          }
          const [version] = parts;
          if (version === "1.1" || version === "1.2") {
            this.yaml.version = version;
            return true;
          } else {
            const isValid = /^\d+\.\d+$/.test(version);
            onError(6, `Unsupported YAML version ${version}`, isValid);
            return false;
          }
        }
        default:
          onError(0, `Unknown directive ${name}`, true);
          return false;
      }
    }
    tagName(source, onError) {
      if (source === "!")
        return "!";
      if (source[0] !== "!") {
        onError(`Not a valid tag: ${source}`);
        return null;
      }
      if (source[1] === "<") {
        const verbatim = source.slice(2, -1);
        if (verbatim === "!" || verbatim === "!!") {
          onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
          return null;
        }
        if (source[source.length - 1] !== ">")
          onError("Verbatim tags must end with a >");
        return verbatim;
      }
      const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
      if (!suffix)
        onError(`The ${source} tag has no suffix`);
      const prefix = this.tags[handle];
      if (prefix) {
        try {
          return prefix + decodeURIComponent(suffix);
        } catch (error) {
          onError(String(error));
          return null;
        }
      }
      if (handle === "!")
        return source;
      onError(`Could not resolve tag: ${source}`);
      return null;
    }
    tagString(tag) {
      for (const [handle, prefix] of Object.entries(this.tags)) {
        if (tag.startsWith(prefix))
          return handle + escapeTagName(tag.substring(prefix.length));
      }
      return tag[0] === "!" ? tag : `!<${tag}>`;
    }
    toString(doc) {
      const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
      const tagEntries = Object.entries(this.tags);
      let tagNames;
      if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
        const tags = {};
        visit.visit(doc.contents, (_key, node) => {
          if (identity.isNode(node) && node.tag)
            tags[node.tag] = true;
        });
        tagNames = Object.keys(tags);
      } else
        tagNames = [];
      for (const [handle, prefix] of tagEntries) {
        if (handle === "!!" && prefix === "tag:yaml.org,2002:")
          continue;
        if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
          lines.push(`%TAG ${handle} ${prefix}`);
      }
      return lines.join(`
`);
    }
  }
  Directives.defaultYaml = { explicit: false, version: "1.2" };
  Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
  exports2.Directives = Directives;
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS(function(exports2) {
  var identity = require_identity();
  var visit = require_visit();
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      const sa = JSON.stringify(anchor);
      const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
      throw new Error(msg);
    }
    return true;
  }
  function anchorNames(root) {
    const anchors = new Set;
    visit.visit(root, {
      Value(_key, node) {
        if (node.anchor)
          anchors.add(node.anchor);
      }
    });
    return anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i = 1;; ++i) {
      const name = `${prefix}${i}`;
      if (!exclude.has(name))
        return name;
    }
  }
  function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = new Map;
    let prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source);
        prevAnchors ?? (prevAnchors = anchorNames(doc));
        const anchor = findNewAnchor(prefix, prevAnchors);
        prevAnchors.add(anchor);
        return anchor;
      },
      setAnchors: () => {
        for (const source of aliasObjects) {
          const ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
            ref.node.anchor = ref.anchor;
          } else {
            const error = new Error("Failed to resolve repeated object (this should not happen)");
            error.source = source;
            throw error;
          }
        }
      },
      sourceObjects
    };
  }
  exports2.anchorIsValid = anchorIsValid;
  exports2.anchorNames = anchorNames;
  exports2.createNodeAnchors = createNodeAnchors;
  exports2.findNewAnchor = findNewAnchor;
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS(function(exports2) {
  function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length;i < len; ++i) {
          const v0 = val[i];
          const v1 = applyReviver(reviver, val, String(i), v0);
          if (v1 === undefined)
            delete val[i];
          else if (v1 !== v0)
            val[i] = v1;
        }
      } else if (val instanceof Map) {
        for (const k of Array.from(val.keys())) {
          const v0 = val.get(k);
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === undefined)
            val.delete(k);
          else if (v1 !== v0)
            val.set(k, v1);
        }
      } else if (val instanceof Set) {
        for (const v0 of Array.from(val)) {
          const v1 = applyReviver(reviver, val, v0, v0);
          if (v1 === undefined)
            val.delete(v0);
          else if (v1 !== v0) {
            val.delete(v0);
            val.add(v1);
          }
        }
      } else {
        for (const [k, v0] of Object.entries(val)) {
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === undefined)
            delete val[k];
          else if (v1 !== v0)
            val[k] = v1;
        }
      }
    }
    return reviver.call(obj, key, val);
  }
  exports2.applyReviver = applyReviver;
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS(function(exports2) {
  var identity = require_identity();
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !identity.hasAnchor(value))
        return value.toJSON(arg, ctx);
      const data = { aliasCount: 0, count: 1, res: undefined };
      ctx.anchors.set(value, data);
      ctx.onCreate = (res) => {
        data.res = res;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }
  exports2.toJS = toJS;
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS(function(exports2) {
  var applyReviver = require_applyReviver();
  var identity = require_identity();
  var toJS = require_toJS();

  class NodeBase {
    constructor(type) {
      Object.defineProperty(this, identity.NODE_TYPE, { value: type });
    }
    clone() {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      if (!identity.isDocument(doc))
        throw new TypeError("A document argument is required");
      const ctx = {
        anchors: new Map,
        doc,
        keep: true,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS.toJS(this, "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res } of ctx.anchors.values())
          onAnchor(res, count);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
  }
  exports2.NodeBase = NodeBase;
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS(function(exports2) {
  var anchors = require_anchors();
  var visit = require_visit();
  var identity = require_identity();
  var Node = require_Node();
  var toJS = require_toJS();

  class Alias extends Node.NodeBase {
    constructor(source) {
      super(identity.ALIAS);
      this.source = source;
      Object.defineProperty(this, "tag", {
        set() {
          throw new Error("Alias nodes cannot have tags");
        }
      });
    }
    resolve(doc, ctx) {
      let nodes;
      if (ctx?.aliasResolveCache) {
        nodes = ctx.aliasResolveCache;
      } else {
        nodes = [];
        visit.visit(doc, {
          Node: (_key, node) => {
            if (identity.isAlias(node) || identity.hasAnchor(node))
              nodes.push(node);
          }
        });
        if (ctx)
          ctx.aliasResolveCache = nodes;
      }
      let found = undefined;
      for (const node of nodes) {
        if (node === this)
          break;
        if (node.anchor === this.source)
          found = node;
      }
      return found;
    }
    toJSON(_arg, ctx) {
      if (!ctx)
        return { source: this.source };
      const { anchors, doc, maxAliasCount } = ctx;
      const source = this.resolve(doc, ctx);
      if (!source) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new ReferenceError(msg);
      }
      let data = anchors.get(source);
      if (!data) {
        toJS.toJS(source, null, ctx);
        data = anchors.get(source);
      }
      if (data?.res === undefined) {
        const msg = "This should not happen: Alias anchor was not resolved?";
        throw new ReferenceError(msg);
      }
      if (maxAliasCount >= 0) {
        data.count += 1;
        if (data.aliasCount === 0)
          data.aliasCount = getAliasCount(doc, source, anchors);
        if (data.count * data.aliasCount > maxAliasCount) {
          const msg = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(msg);
        }
      }
      return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
      const src = `*${this.source}`;
      if (ctx) {
        anchors.anchorIsValid(this.source);
        if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new Error(msg);
        }
        if (ctx.implicitKey)
          return `${src} `;
      }
      return src;
    }
  }
  function getAliasCount(doc, node, anchors) {
    if (identity.isAlias(node)) {
      const source = node.resolve(doc);
      const anchor = anchors && source && anchors.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (identity.isCollection(node)) {
      let count = 0;
      for (const item of node.items) {
        const c = getAliasCount(doc, item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (identity.isPair(node)) {
      const kc = getAliasCount(doc, node.key, anchors);
      const vc = getAliasCount(doc, node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }
  exports2.Alias = Alias;
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS(function(exports2) {
  var identity = require_identity();
  var Node = require_Node();
  var toJS = require_toJS();
  var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";

  class Scalar extends Node.NodeBase {
    constructor(value) {
      super(identity.SCALAR);
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  }
  Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
  Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
  Scalar.PLAIN = "PLAIN";
  Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
  exports2.Scalar = Scalar;
  exports2.isScalarValue = isScalarValue;
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS(function(exports2) {
  var Alias = require_Alias();
  var identity = require_identity();
  var Scalar = require_Scalar();
  var defaultTagPrefix = "tag:yaml.org,2002:";
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) ?? match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t) => t.identify?.(value) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (identity.isDocument(value))
      value = value.contents;
    if (identity.isNode(value))
      return value;
    if (identity.isPair(value)) {
      const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
      map.items.push(value);
      return map;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
      value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
    let ref = undefined;
    if (aliasDuplicateObjects && value && typeof value === "object") {
      ref = sourceObjects.get(value);
      if (ref) {
        ref.anchor ?? (ref.anchor = onAnchor(value));
        return new Alias.Alias(ref.anchor);
      } else {
        ref = { anchor: null, node: null };
        sourceObjects.set(value, ref);
      }
    }
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      if (!value || typeof value !== "object") {
        const node = new Scalar.Scalar(value);
        if (ref)
          ref.node = node;
        return node;
      }
      tagObj = value instanceof Map ? schema[identity.MAP] : (Symbol.iterator in Object(value)) ? schema[identity.SEQ] : schema[identity.MAP];
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
    if (tagName)
      node.tag = tagName;
    else if (!tagObj.default)
      node.tag = tagObj.tag;
    if (ref)
      ref.node = node;
    return node;
  }
  exports2.createNode = createNode;
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS(function(exports2) {
  var createNode = require_createNode();
  var identity = require_identity();
  var Node = require_Node();
  function collectionFromPath(schema, path, value) {
    let v = value;
    for (let i = path.length - 1;i >= 0; --i) {
      const k = path[i];
      if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        v = new Map([[k, v]]);
      }
    }
    return createNode.createNode(v, undefined, {
      aliasDuplicateObjects: false,
      keepUndefined: false,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema,
      sourceObjects: new Map
    });
  }
  var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;

  class Collection extends Node.NodeBase {
    constructor(type, schema) {
      super(type);
      Object.defineProperty(this, "schema", {
        value: schema,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    clone(schema) {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (schema)
        copy.schema = schema;
      copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    addIn(path, value) {
      if (isEmptyPath(path))
        this.add(value);
      else {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (identity.isCollection(node))
          node.addIn(rest, value);
        else if (node === undefined && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    deleteIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.delete(key);
      const node = this.get(key, true);
      if (identity.isCollection(node))
        return node.deleteIn(rest);
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    getIn(path, keepScalar) {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (rest.length === 0)
        return !keepScalar && identity.isScalar(node) ? node.value : node;
      else
        return identity.isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
    }
    hasAllNullValues(allowScalar) {
      return this.items.every((node) => {
        if (!identity.isPair(node))
          return false;
        const n = node.value;
        return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    hasIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.has(key);
      const node = this.get(key, true);
      return identity.isCollection(node) ? node.hasIn(rest) : false;
    }
    setIn(path, value) {
      const [key, ...rest] = path;
      if (rest.length === 0) {
        this.set(key, value);
      } else {
        const node = this.get(key, true);
        if (identity.isCollection(node))
          node.setIn(rest, value);
        else if (node === undefined && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
  }
  exports2.Collection = Collection;
  exports2.collectionFromPath = collectionFromPath;
  exports2.isEmptyPath = isEmptyPath;
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS(function(exports2) {
  var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
  function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
      return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
  }
  var lineComment = (str, indent, comment) => str.endsWith(`
`) ? indentComment(comment, indent) : comment.includes(`
`) ? `
` + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
  exports2.indentComment = indentComment;
  exports2.lineComment = lineComment;
  exports2.stringifyComment = stringifyComment;
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS(function(exports2) {
  var FOLD_FLOW = "flow";
  var FOLD_BLOCK = "block";
  var FOLD_QUOTED = "quoted";
  function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
      return text;
    if (lineWidth < minContentWidth)
      minContentWidth = 0;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i, indent.length);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch;ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === `
`) {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text, i, indent.length);
        end = i + indent.length + endStep;
        split = undefined;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== `
` && prev !== "\t") {
          const next = text[i + 1];
          if (next && next !== " " && next !== `
` && next !== "\t")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = undefined;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "\t") {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = undefined;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i = 0;i < folds.length; ++i) {
      const fold = folds[i];
      const end = folds[i + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text, i, indent) {
    let end = i;
    let start = i + 1;
    let ch = text[start];
    while (ch === " " || ch === "\t") {
      if (i < start + indent) {
        ch = text[++i];
      } else {
        do {
          ch = text[++i];
        } while (ch && ch !== `
`);
        end = i;
        start = i + 1;
        ch = text[start];
      }
    }
    return end;
  }
  exports2.FOLD_BLOCK = FOLD_BLOCK;
  exports2.FOLD_FLOW = FOLD_FLOW;
  exports2.FOLD_QUOTED = FOLD_QUOTED;
  exports2.foldFlowLines = foldFlowLines;
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var foldFlowLines = require_foldFlowLines();
  var getFoldOptions = (ctx, isBlock) => ({
    indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
  });
  var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0;i < strLen; ++i) {
      if (str[i] === `
`) {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i];ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + `

`;
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += `
`;
                i += 2;
              }
              str += indent;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes(`
`) || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
      qs = doubleQuotedString;
    else {
      const hasDouble = value.includes('"');
      const hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  var blockEndNewlines;
  try {
    blockEndNewlines = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
  } catch {
    blockEndNewlines = /\n+(?!\n|$)/g;
  }
  function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    if (!blockQuote || /\n[\t ]+$/.test(value)) {
      return quotedString(value, ctx);
    }
    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
      return literal ? `|
` : `>
`;
    let chomp;
    let endStart;
    for (endStart = value.length;endStart > 0; --endStart) {
      const ch = value[endStart - 1];
      if (ch !== `
` && ch !== "\t" && ch !== " ")
        break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf(`
`);
    if (endNlPos === -1) {
      chomp = "-";
    } else if (value === end || endNlPos !== end.length - 1) {
      chomp = "+";
      if (onChompKeep)
        onChompKeep();
    } else {
      chomp = "";
    }
    if (end) {
      value = value.slice(0, -end.length);
      if (end[end.length - 1] === `
`)
        end = end.slice(0, -1);
      end = end.replace(blockEndNewlines, `$&${indent}`);
    }
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0;startEnd < value.length; ++startEnd) {
      const ch = value[startEnd];
      if (ch === " ")
        startWithSpace = true;
      else if (ch === `
`)
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
      value = value.substring(start.length);
      start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? "2" : "1";
    let header = (startWithSpace ? indentSize : "") + chomp;
    if (comment) {
      header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
      if (onComment)
        onComment();
    }
    if (!literal) {
      const foldedValue = value.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
      let literalFallback = false;
      const foldOptions = getFoldOptions(ctx, true);
      if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
        foldOptions.onOverflow = () => {
          literalFallback = true;
        };
      }
      const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
      if (!literalFallback)
        return `>${header}
${indent}${body}`;
    }
    value = value.replace(/\n+/g, `$&${indent}`);
    return `|${header}
${indent}${start}${value}${end}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if (implicitKey && value.includes(`
`) || inFlow && /[[\]{},]/.test(value)) {
      return quotedString(value, ctx);
    }
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || !value.includes(`
`) ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes(`
`)) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
      if (indent === "") {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      } else if (implicitKey && indent === indentStep) {
        return quotedString(value, ctx);
      }
    }
    const str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
      const { compat, tags } = ctx.doc.schema;
      if (tags.some(test) || compat?.some(test))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
      switch (_type) {
        case Scalar.Scalar.BLOCK_FOLDED:
        case Scalar.Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    let res = _stringify(type);
    if (res === null) {
      const { defaultKeyType, defaultStringType } = ctx.options;
      const t = implicitKey && defaultKeyType || defaultStringType;
      res = _stringify(t);
      if (res === null)
        throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
  }
  exports2.stringifyString = stringifyString;
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS(function(exports2) {
  var anchors = require_anchors();
  var identity = require_identity();
  var stringifyComment = require_stringifyComment();
  var stringifyString = require_stringifyString();
  function createStringifyContext(doc, options) {
    const opt = Object.assign({
      blockQuote: true,
      commentString: stringifyComment.stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: true,
      indentSeq: true,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: false,
      singleQuote: null,
      trueStr: "true",
      verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = false;
        break;
      case "flow":
        inFlow = true;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: new Set,
      doc,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) ?? match[0];
    }
    let tagObj = undefined;
    let obj;
    if (identity.isScalar(item)) {
      obj = item.value;
      let match = tags.filter((t) => t.identify?.(obj));
      if (match.length > 1) {
        const testMatch = match.filter((t) => t.test);
        if (testMatch.length > 0)
          match = testMatch;
      }
      tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
    if (!doc.directives)
      return "";
    const props = [];
    const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor)) {
      anchors$1.add(anchor);
      props.push(`&${anchor}`);
    }
    const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
    if (tag)
      props.push(doc.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    if (identity.isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (identity.isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item)) {
        throw new TypeError(`Cannot stringify circular structure without alias nodes`);
      } else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = undefined;
    const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
    tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }
  exports2.createStringifyContext = createStringifyContext;
  exports2.stringify = stringify;
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS(function(exports2) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = identity.isNode(key) && key.comment || null;
    if (simpleKeys) {
      if (keyComment) {
        throw new Error("With simple keys, key nodes cannot have comments");
      }
      if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
        const msg = "With simple keys, collection cannot be used as a key value";
        throw new Error(msg);
      }
    }
    let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: false,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = true;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      str = `? ${str}`;
      if (keyComment && !keyCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent}:`;
    } else {
      str = `${str}:`;
      if (keyComment)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (identity.isNode(value)) {
      vsb = !!value.spaceBefore;
      vcb = value.commentBefore;
      valueComment = value.comment;
    } else {
      vsb = false;
      vcb = null;
      valueComment = null;
      if (value && typeof value === "object")
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && identity.isScalar(value))
      ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
      ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
    let ws = " ";
    if (keyComment || vsb || vcb) {
      ws = vsb ? `
` : "";
      if (vcb) {
        const cs = commentString(vcb);
        ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === `
` && valueComment)
          ws = `

`;
      } else {
        ws += `
${ctx.indent}`;
      }
    } else if (!explicitKey && identity.isCollection(value)) {
      const vs0 = valueStr[0];
      const nl0 = valueStr.indexOf(`
`);
      const hasNewline = nl0 !== -1;
      const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow) {
        let hasPropsLine = false;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          }
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = true;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === `
`) {
      ws = "";
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone) {
      str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
    } else if (chompKeep && onChompKeep) {
      onChompKeep();
    }
    return str;
  }
  exports2.stringifyPair = stringifyPair;
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS(function(exports2) {
  var node_process = require("process");
  function debug(logLevel, ...messages) {
    if (logLevel === "debug")
      console.log(...messages);
  }
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn") {
      if (typeof node_process.emitWarning === "function")
        node_process.emitWarning(warning);
      else
        console.warn(warning);
    }
  }
  exports2.debug = debug;
  exports2.warn = warn;
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS(function(exports2) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var MERGE_KEY = "<<";
  var merge = {
    identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
    default: "key",
    tag: "tag:yaml.org,2002:merge",
    test: /^<<$/,
    resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
      addToJSMap: addMergeToJSMap
    }),
    stringify: () => MERGE_KEY
  };
  var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
  function addMergeToJSMap(ctx, map, value) {
    value = ctx && identity.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (identity.isSeq(value))
      for (const it of value.items)
        mergeValue(ctx, map, it);
    else if (Array.isArray(value))
      for (const it of value)
        mergeValue(ctx, map, it);
    else
      mergeValue(ctx, map, value);
  }
  function mergeValue(ctx, map, value) {
    const source = ctx && identity.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!identity.isMap(source))
      throw new Error("Merge sources must be maps or map aliases");
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value] of srcMap) {
      if (map instanceof Map) {
        if (!map.has(key))
          map.set(key, value);
      } else if (map instanceof Set) {
        map.add(key);
      } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
        Object.defineProperty(map, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return map;
  }
  exports2.addMergeToJSMap = addMergeToJSMap;
  exports2.isMergeKey = isMergeKey;
  exports2.merge = merge;
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS(function(exports2) {
  var log = require_log();
  var merge = require_merge();
  var stringify = require_stringify();
  var identity = require_identity();
  var toJS = require_toJS();
  function addPairToJSMap(ctx, map, { key, value }) {
    if (identity.isNode(key) && key.addToJSMap)
      key.addToJSMap(ctx, map, value);
    else if (merge.isMergeKey(ctx, key))
      merge.addMergeToJSMap(ctx, map, value);
    else {
      const jsKey = toJS.toJS(key, "", ctx);
      if (map instanceof Map) {
        map.set(jsKey, toJS.toJS(value, jsKey, ctx));
      } else if (map instanceof Set) {
        map.add(jsKey);
      } else {
        const stringKey = stringifyKey(key, jsKey, ctx);
        const jsValue = toJS.toJS(value, stringKey, ctx);
        if (stringKey in map)
          Object.defineProperty(map, stringKey, {
            value: jsValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map[stringKey] = jsValue;
      }
    }
    return map;
  }
  function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (identity.isNode(key) && ctx?.doc) {
      const strCtx = stringify.createStringifyContext(ctx.doc, {});
      strCtx.anchors = new Set;
      for (const node of ctx.anchors.keys())
        strCtx.anchors.add(node.anchor);
      strCtx.inFlow = true;
      strCtx.inStringifyKey = true;
      const strKey = key.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
        ctx.mapKeyWarned = true;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }
  exports2.addPairToJSMap = addPairToJSMap;
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS(function(exports2) {
  var createNode = require_createNode();
  var stringifyPair = require_stringifyPair();
  var addPairToJSMap = require_addPairToJSMap();
  var identity = require_identity();
  function createPair(key, value, ctx) {
    const k = createNode.createNode(key, undefined, ctx);
    const v = createNode.createNode(value, undefined, ctx);
    return new Pair(k, v);
  }

  class Pair {
    constructor(key, value = null) {
      Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
      this.key = key;
      this.value = value;
    }
    clone(schema) {
      let { key, value } = this;
      if (identity.isNode(key))
        key = key.clone(schema);
      if (identity.isNode(value))
        value = value.clone(schema);
      return new Pair(key, value);
    }
    toJSON(_, ctx) {
      const pair = ctx?.mapAsMap ? new Map : {};
      return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
    }
  }
  exports2.Pair = Pair;
  exports2.createPair = createPair;
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS(function(exports2) {
  var identity = require_identity();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyCollection(collection, ctx, options) {
    const flow = ctx.inFlow ?? collection.flow;
    const stringify = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false;
    const lines = [];
    for (let i = 0;i < items.length; ++i) {
      const item = items[i];
      let comment = null;
      if (identity.isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
        if (item.comment)
          comment = item.comment;
      } else if (identity.isPair(item)) {
        const ik = identity.isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = false;
      let str = stringify.stringify(item, itemCtx, () => comment = null, () => chompKeep = true);
      if (comment)
        str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
      if (chompKeep && comment)
        chompKeep = false;
      lines.push(blockItemPrefix + str);
    }
    let str;
    if (lines.length === 0) {
      str = flowChars.start + flowChars.end;
    } else {
      str = lines[0];
      for (let i = 1;i < lines.length; ++i) {
        const line = lines[i];
        str += line ? `
${indent}${line}` : `
`;
      }
    }
    if (comment) {
      str += `
` + stringifyComment.indentComment(commentString(comment), indent);
      if (onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
    const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: true,
      type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0;i < items.length; ++i) {
      const item = items[i];
      let comment = null;
      if (identity.isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, false);
        if (item.comment)
          comment = item.comment;
      } else if (identity.isPair(item)) {
        const ik = identity.isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, false);
          if (ik.comment)
            reqNewline = true;
        }
        const iv = identity.isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment = iv.comment;
          if (iv.commentBefore)
            reqNewline = true;
        } else if (item.value == null && ik?.comment) {
          comment = ik.comment;
        }
      }
      if (comment)
        reqNewline = true;
      let str = stringify.stringify(item, itemCtx, () => comment = null);
      if (i < items.length - 1)
        str += ",";
      if (comment)
        str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
      if (!reqNewline && (lines.length > linesAtValue || str.includes(`
`)))
        reqNewline = true;
      lines.push(str);
      linesAtValue = lines.length;
    }
    const { start, end } = flowChars;
    if (lines.length === 0) {
      return start + end;
    } else {
      if (!reqNewline) {
        const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (const line of lines)
          str += line ? `
${indentStep}${indent}${line}` : `
`;
        return `${str}
${indent}${end}`;
      } else {
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
      }
    }
  }
  function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
      comment = comment.replace(/^\n+/, "");
    if (comment) {
      const ic = stringifyComment.indentComment(commentString(comment), indent);
      lines.push(ic.trimStart());
    }
  }
  exports2.stringifyCollection = stringifyCollection;
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS(function(exports2) {
  var stringifyCollection = require_stringifyCollection();
  var addPairToJSMap = require_addPairToJSMap();
  var Collection = require_Collection();
  var identity = require_identity();
  var Pair = require_Pair();
  var Scalar = require_Scalar();
  function findPair(items, key) {
    const k = identity.isScalar(key) ? key.value : key;
    for (const it of items) {
      if (identity.isPair(it)) {
        if (it.key === key || it.key === k)
          return it;
        if (identity.isScalar(it.key) && it.key.value === k)
          return it;
      }
    }
    return;
  }

  class YAMLMap extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(schema) {
      super(identity.MAP, schema);
      this.items = [];
    }
    static from(schema, obj, ctx) {
      const { keepUndefined, replacer } = ctx;
      const map = new this(schema);
      const add = (key, value) => {
        if (typeof replacer === "function")
          value = replacer.call(obj, key, value);
        else if (Array.isArray(replacer) && !replacer.includes(key))
          return;
        if (value !== undefined || keepUndefined)
          map.items.push(Pair.createPair(key, value, ctx));
      };
      if (obj instanceof Map) {
        for (const [key, value] of obj)
          add(key, value);
      } else if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj))
          add(key, obj[key]);
      }
      if (typeof schema.sortMapEntries === "function") {
        map.items.sort(schema.sortMapEntries);
      }
      return map;
    }
    add(pair, overwrite) {
      let _pair;
      if (identity.isPair(pair))
        _pair = pair;
      else if (!pair || typeof pair !== "object" || !("key" in pair)) {
        _pair = new Pair.Pair(pair, pair?.value);
      } else
        _pair = new Pair.Pair(pair.key, pair.value);
      const prev = findPair(this.items, _pair.key);
      const sortEntries = this.schema?.sortMapEntries;
      if (prev) {
        if (!overwrite)
          throw new Error(`Key ${_pair.key} already set`);
        if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
          prev.value.value = _pair.value;
        else
          prev.value = _pair.value;
      } else if (sortEntries) {
        const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
        if (i === -1)
          this.items.push(_pair);
        else
          this.items.splice(i, 0, _pair);
      } else {
        this.items.push(_pair);
      }
    }
    delete(key) {
      const it = findPair(this.items, key);
      if (!it)
        return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const it = findPair(this.items, key);
      const node = it?.value;
      return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? undefined;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair.Pair(key, value), true);
    }
    toJSON(_, ctx, Type) {
      const map = Type ? new Type : ctx?.mapAsMap ? new Map : {};
      if (ctx?.onCreate)
        ctx.onCreate(map);
      for (const item of this.items)
        addPairToJSMap.addPairToJSMap(ctx, map, item);
      return map;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (const item of this.items) {
        if (!identity.isPair(item))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }
      if (!ctx.allNullValues && this.hasAllNullValues(false))
        ctx = Object.assign({}, ctx, { allNullValues: true });
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: ctx.indent || "",
        onChompKeep,
        onComment
      });
    }
  }
  exports2.YAMLMap = YAMLMap;
  exports2.findPair = findPair;
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS(function(exports2) {
  var identity = require_identity();
  var YAMLMap = require_YAMLMap();
  var map = {
    collection: "map",
    default: true,
    nodeClass: YAMLMap.YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve(map, onError) {
      if (!identity.isMap(map))
        onError("Expected a mapping for this tag");
      return map;
    },
    createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
  };
  exports2.map = map;
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS(function(exports2) {
  var createNode = require_createNode();
  var stringifyCollection = require_stringifyCollection();
  var Collection = require_Collection();
  var identity = require_identity();
  var Scalar = require_Scalar();
  var toJS = require_toJS();

  class YAMLSeq extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(schema) {
      super(identity.SEQ, schema);
      this.items = [];
    }
    add(value) {
      this.items.push(value);
    }
    delete(key) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return;
      const it = this.items[idx];
      return !keepScalar && identity.isScalar(it) ? it.value : it;
    }
    has(key) {
      const idx = asItemIndex(key);
      return typeof idx === "number" && idx < this.items.length;
    }
    set(key, value) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        throw new Error(`Expected a valid index, not ${key}.`);
      const prev = this.items[idx];
      if (identity.isScalar(prev) && Scalar.isScalarValue(value))
        prev.value = value;
      else
        this.items[idx] = value;
    }
    toJSON(_, ctx) {
      const seq = [];
      if (ctx?.onCreate)
        ctx.onCreate(seq);
      let i = 0;
      for (const item of this.items)
        seq.push(toJS.toJS(item, String(i++), ctx));
      return seq;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (ctx.indent || "") + "  ",
        onChompKeep,
        onComment
      });
    }
    static from(schema, obj, ctx) {
      const { replacer } = ctx;
      const seq = new this(schema);
      if (obj && Symbol.iterator in Object(obj)) {
        let i = 0;
        for (let it of obj) {
          if (typeof replacer === "function") {
            const key = obj instanceof Set ? it : String(i++);
            it = replacer.call(obj, key, it);
          }
          seq.items.push(createNode.createNode(it, undefined, ctx));
        }
      }
      return seq;
    }
  }
  function asItemIndex(key) {
    let idx = identity.isScalar(key) ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  exports2.YAMLSeq = YAMLSeq;
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS(function(exports2) {
  var identity = require_identity();
  var YAMLSeq = require_YAMLSeq();
  var seq = {
    collection: "seq",
    default: true,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve(seq, onError) {
      if (!identity.isSeq(seq))
        onError("Expected a sequence for this tag");
      return seq;
    },
    createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
  };
  exports2.seq = seq;
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS(function(exports2) {
  var stringifyString = require_stringifyString();
  var string = {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({ actualString: true }, ctx);
      return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
  };
  exports2.string = string;
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var nullTag = {
    identify: (value) => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
  };
  exports2.nullTag = nullTag;
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var boolTag = {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
    stringify({ source, value }, ctx) {
      if (source && boolTag.test.test(source)) {
        const sv = source[0] === "t" || source[0] === "T";
        if (value === sv)
          return source;
      }
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
  };
  exports2.boolTag = boolTag;
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS(function(exports2) {
  function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    const num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }
  exports2.stringifyNumber = stringifyNumber;
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var stringifyNumber = require_stringifyNumber();
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
      const node = new Scalar.Scalar(parseFloat(str));
      const dot = str.indexOf(".");
      if (dot !== -1 && str[str.length - 1] === "0")
        node.minFractionDigits = str.length - dot - 1;
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports2.float = float;
  exports2.floatExp = floatExp;
  exports2.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS(function(exports2) {
  var stringifyNumber = require_stringifyNumber();
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
  }
  var intOct = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: (node) => intStringify(node, 8, "0o")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  };
  var intHex = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports2.int = int;
  exports2.intHex = intHex;
  exports2.intOct = intOct;
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS(function(exports2) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var bool = require_bool();
  var float = require_float();
  var int = require_int();
  var schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.boolTag,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
  ];
  exports2.schema = schema;
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var map = require_map();
  var seq = require_seq();
  function intIdentify(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON = ({ value }) => JSON.stringify(value);
  var jsonScalars = [
    {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify: stringifyJSON
    },
    {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^null$/,
      resolve: () => null,
      stringify: stringifyJSON
    },
    {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^true$|^false$/,
      resolve: (str) => str === "true",
      stringify: stringifyJSON
    },
    {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
      stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: (str) => parseFloat(str),
      stringify: stringifyJSON
    }
  ];
  var jsonError = {
    default: true,
    tag: "",
    test: /^/,
    resolve(str, onError) {
      onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
      return str;
    }
  };
  var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
  exports2.schema = schema;
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS(function(exports2) {
  var node_buffer = require("buffer");
  var Scalar = require_Scalar();
  var stringifyString = require_stringifyString();
  var binary = {
    identify: (value) => value instanceof Uint8Array,
    default: false,
    tag: "tag:yaml.org,2002:binary",
    resolve(src, onError) {
      if (typeof node_buffer.Buffer === "function") {
        return node_buffer.Buffer.from(src, "base64");
      } else if (typeof atob === "function") {
        const str = atob(src.replace(/[\n\r]/g, ""));
        const buffer = new Uint8Array(str.length);
        for (let i = 0;i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        onError("This environment does not support reading binary tags; either Buffer or atob is required");
        return src;
      }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
      if (!value)
        return "";
      const buf = value;
      let str;
      if (typeof node_buffer.Buffer === "function") {
        str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
      } else if (typeof btoa === "function") {
        let s = "";
        for (let i = 0;i < buf.length; ++i)
          s += String.fromCharCode(buf[i]);
        str = btoa(s);
      } else {
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      }
      type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
        const n = Math.ceil(str.length / lineWidth);
        const lines = new Array(n);
        for (let i = 0, o = 0;i < n; ++i, o += lineWidth) {
          lines[i] = str.substr(o, lineWidth);
        }
        str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? `
` : " ");
      }
      return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
  };
  exports2.binary = binary;
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS(function(exports2) {
  var identity = require_identity();
  var Pair = require_Pair();
  var Scalar = require_Scalar();
  var YAMLSeq = require_YAMLSeq();
  function resolvePairs(seq, onError) {
    if (identity.isSeq(seq)) {
      for (let i = 0;i < seq.items.length; ++i) {
        let item = seq.items[i];
        if (identity.isPair(item))
          continue;
        else if (identity.isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            const cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
      }
    } else
      onError("Expected a sequence for this tag");
    return seq;
  }
  function createPairs(schema, iterable, ctx) {
    const { replacer } = ctx;
    const pairs = new YAMLSeq.YAMLSeq(schema);
    pairs.tag = "tag:yaml.org,2002:pairs";
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i++), it);
        let key, value;
        if (Array.isArray(it)) {
          if (it.length === 2) {
            key = it[0];
            value = it[1];
          } else
            throw new TypeError(`Expected [key, value] tuple: ${it}`);
        } else if (it && it instanceof Object) {
          const keys = Object.keys(it);
          if (keys.length === 1) {
            key = keys[0];
            value = it[key];
          } else {
            throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
          }
        } else {
          key = it;
        }
        pairs.items.push(Pair.createPair(key, value, ctx));
      }
    return pairs;
  }
  var pairs = {
    collection: "seq",
    default: false,
    tag: "tag:yaml.org,2002:pairs",
    resolve: resolvePairs,
    createNode: createPairs
  };
  exports2.createPairs = createPairs;
  exports2.pairs = pairs;
  exports2.resolvePairs = resolvePairs;
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS(function(exports2) {
  var identity = require_identity();
  var toJS = require_toJS();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var pairs = require_pairs();

  class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
      super();
      this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
      this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
      this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
      this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
      this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
      this.tag = YAMLOMap.tag;
    }
    toJSON(_, ctx) {
      if (!ctx)
        return super.toJSON(_);
      const map = new Map;
      if (ctx?.onCreate)
        ctx.onCreate(map);
      for (const pair of this.items) {
        let key, value;
        if (identity.isPair(pair)) {
          key = toJS.toJS(pair.key, "", ctx);
          value = toJS.toJS(pair.value, key, ctx);
        } else {
          key = toJS.toJS(pair, "", ctx);
        }
        if (map.has(key))
          throw new Error("Ordered maps must not include duplicate keys");
        map.set(key, value);
      }
      return map;
    }
    static from(schema, iterable, ctx) {
      const pairs$1 = pairs.createPairs(schema, iterable, ctx);
      const omap = new this;
      omap.items = pairs$1.items;
      return omap;
    }
  }
  YAMLOMap.tag = "tag:yaml.org,2002:omap";
  var omap = {
    collection: "seq",
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: "tag:yaml.org,2002:omap",
    resolve(seq, onError) {
      const pairs$1 = pairs.resolvePairs(seq, onError);
      const seenKeys = [];
      for (const { key } of pairs$1.items) {
        if (identity.isScalar(key)) {
          if (seenKeys.includes(key.value)) {
            onError(`Ordered maps must not include duplicate keys: ${key.value}`);
          } else {
            seenKeys.push(key.value);
          }
        }
      }
      return Object.assign(new YAMLOMap, pairs$1);
    },
    createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
  };
  exports2.YAMLOMap = YAMLOMap;
  exports2.omap = omap;
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag = {
    identify: (value) => value === true,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(true),
    stringify: boolStringify
  };
  var falseTag = {
    identify: (value) => value === false,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
    resolve: () => new Scalar.Scalar(false),
    stringify: boolStringify
  };
  exports2.falseTag = falseTag;
  exports2.trueTag = trueTag;
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var stringifyNumber = require_stringifyNumber();
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
      const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
      const dot = str.indexOf(".");
      if (dot !== -1) {
        const f = str.substring(dot + 1).replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node.minFractionDigits = f.length;
      }
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports2.float = float;
  exports2.floatExp = floatExp;
  exports2.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS(function(exports2) {
  var stringifyNumber = require_stringifyNumber();
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === "-" || sign === "+")
      offset += 1;
    str = str.substring(offset).replace(/_/g, "");
    if (intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n = BigInt(str);
      return sign === "-" ? BigInt(-1) * n : n;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
  }
  var intBin = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: (node) => intStringify(node, 2, "0b")
  };
  var intOct = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: (node) => intStringify(node, 8, "0")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  };
  var intHex = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports2.int = int;
  exports2.intBin = intBin;
  exports2.intHex = intHex;
  exports2.intOct = intOct;
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS(function(exports2) {
  var identity = require_identity();
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();

  class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema) {
      super(schema);
      this.tag = YAMLSet.tag;
    }
    add(key) {
      let pair;
      if (identity.isPair(key))
        pair = key;
      else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
        pair = new Pair.Pair(key.key, null);
      else
        pair = new Pair.Pair(key, null);
      const prev = YAMLMap.findPair(this.items, pair.key);
      if (!prev)
        this.items.push(pair);
    }
    get(key, keepPair) {
      const pair = YAMLMap.findPair(this.items, key);
      return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = YAMLMap.findPair(this.items, key);
      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new Pair.Pair(key));
      }
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues(true))
        return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
      else
        throw new Error("Set items must all have null values");
    }
    static from(schema, iterable, ctx) {
      const { replacer } = ctx;
      const set = new this(schema);
      if (iterable && Symbol.iterator in Object(iterable))
        for (let value of iterable) {
          if (typeof replacer === "function")
            value = replacer.call(iterable, value, value);
          set.items.push(Pair.createPair(value, null, ctx));
        }
      return set;
    }
  }
  YAMLSet.tag = "tag:yaml.org,2002:set";
  var set = {
    collection: "map",
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: "tag:yaml.org,2002:set",
    createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
    resolve(map, onError) {
      if (identity.isMap(map)) {
        if (map.hasAllNullValues(true))
          return Object.assign(new YAMLSet, map);
        else
          onError("Set items must all have null values");
      } else
        onError("Expected a mapping for this tag");
      return map;
    }
  };
  exports2.YAMLSet = YAMLSet;
  exports2.set = set;
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS(function(exports2) {
  var stringifyNumber = require_stringifyNumber();
  function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts.replace(/_/g, "").split(":").reduce((res, p) => res * num(60) + num(p), num(0));
    return sign === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === "bigint")
      num = (n) => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber.stringifyNumber(node);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = (value - parts[0]) / _60;
      parts.unshift(value % _60);
      if (value >= 60) {
        value = (value - parts[0]) / _60;
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
  }
  var intTime = {
    identify: (value) => typeof value === "bigint" || Number.isInteger(value),
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
  };
  var floatTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: (str) => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
  };
  var timestamp = {
    identify: (value) => value instanceof Date,
    default: true,
    tag: "tag:yaml.org,2002:timestamp",
    test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})" + "(?:" + "(?:t|T|[ \\t]+)" + "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)" + "(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?" + ")?$"),
    resolve(str) {
      const match = str.match(timestamp.test);
      if (!match)
        throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
      const [, year, month, day, hour, minute, second] = match.map(Number);
      const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
      const tz = match[8];
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz, false);
        if (Math.abs(d) < 30)
          d *= 60;
        date -= 60000 * d;
      }
      return new Date(date);
    },
    stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
  };
  exports2.floatTime = floatTime;
  exports2.intTime = intTime;
  exports2.timestamp = timestamp;
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS(function(exports2) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var binary = require_binary();
  var bool = require_bool2();
  var float = require_float2();
  var int = require_int2();
  var merge = require_merge();
  var omap = require_omap();
  var pairs = require_pairs();
  var set = require_set();
  var timestamp = require_timestamp();
  var schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.trueTag,
    bool.falseTag,
    int.intBin,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    merge.merge,
    omap.omap,
    pairs.pairs,
    set.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
  ];
  exports2.schema = schema;
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS(function(exports2) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var bool = require_bool();
  var float = require_float();
  var int = require_int();
  var schema = require_schema();
  var schema$1 = require_schema2();
  var binary = require_binary();
  var merge = require_merge();
  var omap = require_omap();
  var pairs = require_pairs();
  var schema$2 = require_schema3();
  var set = require_set();
  var timestamp = require_timestamp();
  var schemas = new Map([
    ["core", schema.schema],
    ["failsafe", [map.map, seq.seq, string.string]],
    ["json", schema$1.schema],
    ["yaml11", schema$2.schema],
    ["yaml-1.1", schema$2.schema]
  ]);
  var tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int.int,
    intHex: int.intHex,
    intOct: int.intOct,
    intTime: timestamp.intTime,
    map: map.map,
    merge: merge.merge,
    null: _null.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set.set,
    timestamp: timestamp.timestamp
  };
  var coreKnownTags = {
    "tag:yaml.org,2002:binary": binary.binary,
    "tag:yaml.org,2002:merge": merge.merge,
    "tag:yaml.org,2002:omap": omap.omap,
    "tag:yaml.org,2002:pairs": pairs.pairs,
    "tag:yaml.org,2002:set": set.set,
    "tag:yaml.org,2002:timestamp": timestamp.timestamp
  };
  function getTags(customTags, schemaName, addMergeTag) {
    const schemaTags = schemas.get(schemaName);
    if (schemaTags && !customTags) {
      return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
    }
    let tags = schemaTags;
    if (!tags) {
      if (Array.isArray(customTags))
        tags = [];
      else {
        const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
      }
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags = tags.concat(tag);
    } else if (typeof customTags === "function") {
      tags = customTags(tags.slice());
    }
    if (addMergeTag)
      tags = tags.concat(merge.merge);
    return tags.reduce((tags, tag) => {
      const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
      if (!tagObj) {
        const tagName = JSON.stringify(tag);
        const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
      }
      if (!tags.includes(tagObj))
        tags.push(tagObj);
      return tags;
    }, []);
  }
  exports2.coreKnownTags = coreKnownTags;
  exports2.getTags = getTags;
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS(function(exports2) {
  var identity = require_identity();
  var map = require_map();
  var seq = require_seq();
  var string = require_string();
  var tags = require_tags();
  var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

  class Schema {
    constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
      this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
      this.name = typeof schema === "string" && schema || "core";
      this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
      this.tags = tags.getTags(customTags, this.name, merge);
      this.toStringOptions = toStringDefaults ?? null;
      Object.defineProperty(this, identity.MAP, { value: map.map });
      Object.defineProperty(this, identity.SCALAR, { value: string.string });
      Object.defineProperty(this, identity.SEQ, { value: seq.seq });
      this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
    }
    clone() {
      const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
      copy.tags = this.tags.slice();
      return copy;
    }
  }
  exports2.Schema = Schema;
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS(function(exports2) {
  var identity = require_identity();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
      const dir = doc.directives.toString(doc);
      if (dir) {
        lines.push(dir);
        hasDirectives = true;
      } else if (doc.directives.docStart)
        hasDirectives = true;
    }
    if (hasDirectives)
      lines.push("---");
    const ctx = stringify.createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      const cs = commentString(doc.commentBefore);
      lines.unshift(stringifyComment.indentComment(cs, ""));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
      if (identity.isNode(doc.contents)) {
        if (doc.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc.contents.commentBefore) {
          const cs = commentString(doc.contents.commentBefore);
          lines.push(stringifyComment.indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc.comment;
        contentComment = doc.contents.comment;
      }
      const onChompKeep = contentComment ? undefined : () => chompKeep = true;
      let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body += stringifyComment.lineComment(body, "", commentString(contentComment));
      if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
        lines[lines.length - 1] = `--- ${body}`;
      } else
        lines.push(body);
    } else {
      lines.push(stringify.stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
      if (doc.comment) {
        const cs = commentString(doc.comment);
        if (cs.includes(`
`)) {
          lines.push("...");
          lines.push(stringifyComment.indentComment(cs, ""));
        } else {
          lines.push(`... ${cs}`);
        }
      } else {
        lines.push("...");
      }
    } else {
      let dc = doc.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(stringifyComment.indentComment(commentString(dc), ""));
      }
    }
    return lines.join(`
`) + `
`;
  }
  exports2.stringifyDocument = stringifyDocument;
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS(function(exports2) {
  var Alias = require_Alias();
  var Collection = require_Collection();
  var identity = require_identity();
  var Pair = require_Pair();
  var toJS = require_toJS();
  var Schema = require_Schema();
  var stringifyDocument = require_stringifyDocument();
  var anchors = require_anchors();
  var applyReviver = require_applyReviver();
  var createNode = require_createNode();
  var directives = require_directives();

  class Document {
    constructor(value, replacer, options) {
      this.commentBefore = null;
      this.comment = null;
      this.errors = [];
      this.warnings = [];
      Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === undefined && replacer) {
        options = replacer;
        replacer = undefined;
      }
      const opt = Object.assign({
        intAsBigInt: false,
        keepSourceTokens: false,
        logLevel: "warn",
        prettyErrors: true,
        strict: true,
        stringKeys: false,
        uniqueKeys: true,
        version: "1.2"
      }, options);
      this.options = opt;
      let { version } = opt;
      if (options?._directives) {
        this.directives = options._directives.atDocument();
        if (this.directives.yaml.explicit)
          version = this.directives.yaml.version;
      } else
        this.directives = new directives.Directives({ version });
      this.setSchema(version, options);
      this.contents = value === undefined ? null : this.createNode(value, _replacer, options);
    }
    clone() {
      const copy = Object.create(Document.prototype, {
        [identity.NODE_TYPE]: { value: identity.DOC }
      });
      copy.commentBefore = this.commentBefore;
      copy.comment = this.comment;
      copy.errors = this.errors.slice();
      copy.warnings = this.warnings.slice();
      copy.options = Object.assign({}, this.options);
      if (this.directives)
        copy.directives = this.directives.clone();
      copy.schema = this.schema.clone();
      copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    add(value) {
      if (assertCollection(this.contents))
        this.contents.add(value);
    }
    addIn(path, value) {
      if (assertCollection(this.contents))
        this.contents.addIn(path, value);
    }
    createAlias(node, name) {
      if (!node.anchor) {
        const prev = anchors.anchorNames(this);
        node.anchor = !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
      }
      return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
      let _replacer = undefined;
      if (typeof replacer === "function") {
        value = replacer.call({ "": value }, "", value);
        _replacer = replacer;
      } else if (Array.isArray(replacer)) {
        const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
        const asStr = replacer.filter(keyToStr).map(String);
        if (asStr.length > 0)
          replacer = replacer.concat(asStr);
        _replacer = replacer;
      } else if (options === undefined && replacer) {
        options = replacer;
        replacer = undefined;
      }
      const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
      const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || "a");
      const ctx = {
        aliasDuplicateObjects: aliasDuplicateObjects ?? true,
        keepUndefined: keepUndefined ?? false,
        onAnchor,
        onTagObj,
        replacer: _replacer,
        schema: this.schema,
        sourceObjects
      };
      const node = createNode.createNode(value, tag, ctx);
      if (flow && identity.isCollection(node))
        node.flow = true;
      setAnchors();
      return node;
    }
    createPair(key, value, options = {}) {
      const k = this.createNode(key, null, options);
      const v = this.createNode(value, null, options);
      return new Pair.Pair(k, v);
    }
    delete(key) {
      return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    deleteIn(path) {
      if (Collection.isEmptyPath(path)) {
        if (this.contents == null)
          return false;
        this.contents = null;
        return true;
      }
      return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
    }
    get(key, keepScalar) {
      return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : undefined;
    }
    getIn(path, keepScalar) {
      if (Collection.isEmptyPath(path))
        return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
      return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : undefined;
    }
    has(key) {
      return identity.isCollection(this.contents) ? this.contents.has(key) : false;
    }
    hasIn(path) {
      if (Collection.isEmptyPath(path))
        return this.contents !== undefined;
      return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    set(key, value) {
      if (this.contents == null) {
        this.contents = Collection.collectionFromPath(this.schema, [key], value);
      } else if (assertCollection(this.contents)) {
        this.contents.set(key, value);
      }
    }
    setIn(path, value) {
      if (Collection.isEmptyPath(path)) {
        this.contents = value;
      } else if (this.contents == null) {
        this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
      } else if (assertCollection(this.contents)) {
        this.contents.setIn(path, value);
      }
    }
    setSchema(version, options = {}) {
      if (typeof version === "number")
        version = String(version);
      let opt;
      switch (version) {
        case "1.1":
          if (this.directives)
            this.directives.yaml.version = "1.1";
          else
            this.directives = new directives.Directives({ version: "1.1" });
          opt = { resolveKnownTags: false, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives)
            this.directives.yaml.version = version;
          else
            this.directives = new directives.Directives({ version });
          opt = { resolveKnownTags: true, schema: "core" };
          break;
        case null:
          if (this.directives)
            delete this.directives;
          opt = null;
          break;
        default: {
          const sv = JSON.stringify(version);
          throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
        }
      }
      if (options.schema instanceof Object)
        this.schema = options.schema;
      else if (opt)
        this.schema = new Schema.Schema(Object.assign(opt, options));
      else
        throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      const ctx = {
        anchors: new Map,
        doc: this,
        keep: !json,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res } of ctx.anchors.values())
          onAnchor(res, count);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
    toJSON(jsonArg, onAnchor) {
      return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    toString(options = {}) {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
        const s = JSON.stringify(options.indent);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      return stringifyDocument.stringifyDocument(this, options);
    }
  }
  function assertCollection(contents) {
    if (identity.isCollection(contents))
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }
  exports2.Document = Document;
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS(function(exports2) {
  class YAMLError extends Error {
    constructor(name, pos, code, message) {
      super();
      this.name = name;
      this.code = code;
      this.message = message;
      this.pos = pos;
    }
  }

  class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLParseError", pos, code, message);
    }
  }

  class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLWarning", pos, code, message);
    }
  }
  var prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
      return;
    error.linePos = error.pos.map((pos) => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
    if (ci >= 60 && lineStr.length > 80) {
      const trimStart = Math.min(ci - 39, lineStr.length - 79);
      lineStr = "…" + lineStr.substring(trimStart);
      ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
      lineStr = lineStr.substring(0, 79) + "…";
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
      let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
      if (prev.length > 80)
        prev = prev.substring(0, 79) + `…
`;
      lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
      let count = 1;
      const end = error.linePos[1];
      if (end?.line === line && end.col > col) {
        count = Math.max(1, Math.min(end.col - col, 80 - ci));
      }
      const pointer = " ".repeat(ci) + "^".repeat(count);
      error.message += `:

${lineStr}
${pointer}
`;
    }
  };
  exports2.YAMLError = YAMLError;
  exports2.YAMLParseError = YAMLParseError;
  exports2.YAMLWarning = YAMLWarning;
  exports2.prettifyError = prettifyError;
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS(function(exports2) {
  function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = "";
    let commentSep = "";
    let hasNewline = false;
    let reqSpace = false;
    let tab = null;
    let anchor = null;
    let tag = null;
    let newlineAfterProp = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = false;
      }
      if (tab) {
        if (atNewline && token.type !== "comment" && token.type !== "newline") {
          onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        }
        tab = null;
      }
      switch (token.type) {
        case "space":
          if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("\t")) {
            tab = token;
          }
          hasSpace = true;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = token.source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += commentSep + cb;
          commentSep = "";
          atNewline = false;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment)
              comment += token.source;
            else if (!found || indicator !== "seq-item-ind")
              spaceBefore = true;
          } else
            commentSep += token.source;
          atNewline = true;
          hasNewline = true;
          if (anchor || tag)
            newlineAfterProp = token;
          hasSpace = true;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
          anchor = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
          found = token;
          atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
          hasSpace = false;
          break;
        case "comma":
          if (flow) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
            comma = token;
            atNewline = false;
            hasSpace = false;
            break;
          }
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
          atNewline = false;
          hasSpace = false;
      }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    }
    if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
      onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma,
      found,
      spaceBefore,
      comment,
      hasNewline,
      anchor,
      tag,
      newlineAfterProp,
      end,
      start: start ?? end
    };
  }
  exports2.resolveProps = resolveProps;
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS(function(exports2) {
  function containsNewline(key) {
    if (!key)
      return null;
    switch (key.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key.source.includes(`
`))
          return true;
        if (key.end) {
          for (const st of key.end)
            if (st.type === "newline")
              return true;
        }
        return false;
      case "flow-collection":
        for (const it of key.items) {
          for (const st of it.start)
            if (st.type === "newline")
              return true;
          if (it.sep) {
            for (const st of it.sep)
              if (st.type === "newline")
                return true;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return true;
        }
        return false;
      default:
        return true;
    }
  }
  exports2.containsNewline = containsNewline;
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS(function(exports2) {
  var utilContainsNewline = require_util_contains_newline();
  function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === "flow-collection") {
      const end = fc.end[0];
      if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
        const msg = "Flow end indicator should be more indented than parent";
        onError(end, "BAD_INDENT", msg, true);
      }
    }
  }
  exports2.flowIndentCheck = flowIndentCheck;
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS(function(exports2) {
  var identity = require_identity();
  function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
      return false;
    const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
    return items.some((pair) => isEqual(pair.key, search));
  }
  exports2.mapIncludes = mapIncludes;
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS(function(exports2) {
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();
  var resolveProps = require_resolve_props();
  var utilContainsNewline = require_util_contains_newline();
  var utilFlowIndentCheck = require_util_flow_indent_check();
  var utilMapIncludes = require_util_map_includes();
  var startColMsg = "All mapping items must start at the same column";
  function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
    const map = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
      const { start, key, sep, value } = collItem;
      const keyProps = resolveProps.resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: bm.indent,
        startOnNewline: true
      });
      const implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key) {
          if (key.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key && key.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep) {
          commentEnd = keyProps.end;
          if (keyProps.comment) {
            if (map.comment)
              map.comment += `
` + keyProps.comment;
            else
              map.comment = keyProps.comment;
          }
          continue;
        }
        if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
          onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        }
      } else if (keyProps.found?.indent !== bm.indent) {
        onError(offset, "BAD_INDENT", startColMsg);
      }
      ctx.atKey = true;
      const keyStart = keyProps.end;
      const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
      ctx.atKey = false;
      if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      const valueProps = resolveProps.resolveProps(sep ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: bm.indent,
        startOnNewline: !key || key.type === "block-scalar"
      });
      offset = valueProps.end;
      if (valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        const pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair.Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    map.range = [bm.offset, offset, commentEnd ?? offset];
    return map;
  }
  exports2.resolveBlockMap = resolveBlockMap;
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS(function(exports2) {
  var YAMLSeq = require_YAMLSeq();
  var resolveProps = require_resolve_props();
  var utilFlowIndentCheck = require_util_flow_indent_check();
  function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
    const seq = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
      const props = resolveProps.resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        parentIndent: bs.indent,
        startOnNewline: true
      });
      if (!props.found) {
        if (props.anchor || props.tag || value) {
          if (value?.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        } else {
          commentEnd = props.end;
          if (props.comment)
            seq.comment = props.comment;
          continue;
        }
      }
      const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
      offset = node.range[2];
      seq.items.push(node);
    }
    seq.range = [bs.offset, offset, commentEnd ?? offset];
    return seq;
  }
  exports2.resolveBlockSeq = resolveBlockSeq;
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS(function(exports2) {
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment = "";
    if (end) {
      let hasSpace = false;
      let sep = "";
      for (const token of end) {
        const { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = true;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += sep + cb;
            sep = "";
            break;
          }
          case "newline":
            if (comment)
              sep += source;
            hasSpace = true;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment, offset };
  }
  exports2.resolveEnd = resolveEnd;
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS(function(exports2) {
  var identity = require_identity();
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var resolveEnd = require_resolve_end();
  var resolveProps = require_resolve_props();
  var utilContainsNewline = require_util_contains_newline();
  var utilMapIncludes = require_util_map_includes();
  var blockMsg = "Block collections are not allowed within flow collections";
  var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
  function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
    const isMap = fc.start.source === "{";
    const fcName = isMap ? "flow map" : "flow sequence";
    const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
    const coll = new NodeClass(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0;i < fc.items.length; ++i) {
      const collItem = fc.items[i];
      const { start, key, sep, value } = collItem;
      const props = resolveProps.resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep && !value) {
          if (i === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment) {
            if (coll.comment)
              coll.comment += `
` + props.comment;
            else
              coll.comment = props.comment;
          }
          offset = props.end;
          continue;
        }
        if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
          onError(key, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (i === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop:
            for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (identity.isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += `
` + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap && !sep && !props.found) {
        const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
        coll.items.push(valueNode);
        offset = valueNode.range[2];
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        ctx.atKey = true;
        const keyStart = props.end;
        const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
        if (isBlock(key))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        ctx.atKey = false;
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (valueProps.found) {
          if (!isMap && !props.found && ctx.options.strict) {
            if (sep)
              for (const st of sep) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value) {
          if ("source" in value && value.source?.[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        }
        const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap) {
          const map = coll;
          if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map.items.push(pair);
        } else {
          const map = new YAMLMap.YAMLMap(ctx.schema);
          map.flow = true;
          map.items.push(pair);
          const endRange = (valueNode ?? keyNode).range;
          map.range = [keyNode.range[0], endRange[1], endRange[2]];
          coll.items.push(map);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    const expectedEnd = isMap ? "}" : "]";
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce?.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      const name = fcName[0].toUpperCase() + fcName.substring(1);
      const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
      if (ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment) {
        if (coll.comment)
          coll.comment += `
` + end.comment;
        else
          coll.comment = end.comment;
      }
      coll.range = [fc.offset, cePos, end.offset];
    } else {
      coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
  }
  exports2.resolveFlowCollection = resolveFlowCollection;
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS(function(exports2) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var resolveBlockMap = require_resolve_block_map();
  var resolveBlockSeq = require_resolve_block_seq();
  var resolveFlowCollection = require_resolve_flow_collection();
  function resolveCollection(CN, ctx, token, onError, tagName, tag) {
    const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
    const Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName) {
      coll.tag = Coll.tagName;
      return coll;
    }
    if (tagName)
      coll.tag = tagName;
    return coll;
  }
  function composeCollection(CN, ctx, token, props, onError) {
    const tagToken = props.tag;
    const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (token.type === "block-seq") {
      const { anchor, newlineAfterProp: nl } = props;
      const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
      if (lastProp && (!nl || nl.offset < lastProp.offset)) {
        const message = "Missing newline after block sequence props";
        onError(lastProp, "MISSING_CHAR", message);
      }
    }
    const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
    if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
      return resolveCollection(CN, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
    if (!tag) {
      const kt = ctx.schema.knownTags[tagName];
      if (kt?.collection === expType) {
        ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
        tag = kt;
      } else {
        if (kt) {
          onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
        } else {
          onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
        }
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
    }
    const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
    const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
      node.format = tag.format;
    return node;
  }
  exports2.composeCollection = composeCollection;
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  function resolveBlockScalar(ctx, scalar, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    let chompStart = lines.length;
    for (let i = lines.length - 1;i >= 0; --i) {
      const content = lines[i][1];
      if (content === "" || content === "\r")
        chompStart = i;
      else
        break;
    }
    if (chompStart === 0) {
      const value = header.chomp === "+" && lines.length > 0 ? `
`.repeat(Math.max(1, lines.length - 1)) : "";
      let end = start + header.length;
      if (scalar.source)
        end += scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0;i < chompStart; ++i) {
      const [indent, content] = lines[i];
      if (content === "" || content === "\r") {
        if (header.indent === 0 && indent.length > trimIndent)
          trimIndent = indent.length;
      } else {
        if (indent.length < trimIndent) {
          const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
          onError(offset + indent.length, "MISSING_CHAR", message);
        }
        if (header.indent === 0)
          trimIndent = indent.length;
        contentStart = i;
        if (trimIndent === 0 && !ctx.atRoot) {
          const message = "Block scalar values in collections must be indented";
          onError(offset, "BAD_INDENT", message);
        }
        break;
      }
      offset += indent.length + content.length + 1;
    }
    for (let i = lines.length - 1;i >= chompStart; --i) {
      if (lines[i][0].length > trimIndent)
        chompStart = i + 1;
    }
    let value = "";
    let sep = "";
    let prevMoreIndented = false;
    for (let i = 0;i < contentStart; ++i)
      value += lines[i][0].slice(trimIndent) + `
`;
    for (let i = contentStart;i < chompStart; ++i) {
      let [indent, content] = lines[i];
      offset += indent.length + content.length + 1;
      const crlf = content[content.length - 1] === "\r";
      if (crlf)
        content = content.slice(0, -1);
      if (content && indent.length < trimIndent) {
        const src = header.indent ? "explicit indentation indicator" : "first line";
        const message = `Block scalar lines must not be less indented than their ${src}`;
        onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
        indent = "";
      }
      if (type === Scalar.Scalar.BLOCK_LITERAL) {
        value += sep + indent.slice(trimIndent) + content;
        sep = `
`;
      } else if (indent.length > trimIndent || content[0] === "\t") {
        if (sep === " ")
          sep = `
`;
        else if (!prevMoreIndented && sep === `
`)
          sep = `

`;
        value += sep + indent.slice(trimIndent) + content;
        sep = `
`;
        prevMoreIndented = true;
      } else if (content === "") {
        if (sep === `
`)
          value += `
`;
        else
          sep = `
`;
      } else {
        value += sep + content;
        sep = " ";
        prevMoreIndented = false;
      }
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i = chompStart;i < lines.length; ++i)
          value += `
` + lines[i][0].slice(trimIndent);
        if (value[value.length - 1] !== `
`)
          value += `
`;
        break;
      default:
        value += `
`;
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header") {
      onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
      return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = "";
    let error = -1;
    for (let i = 1;i < source.length; ++i) {
      const ch = source[i];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        const n = Number(ch);
        if (!indent && n)
          indent = n;
        else if (error === -1)
          error = offset + i;
      }
    }
    if (error !== -1)
      onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = "";
    let length = source.length;
    for (let i = 1;i < props.length; ++i) {
      const token = props[i];
      switch (token.type) {
        case "space":
          hasSpace = true;
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace) {
            const message = "Comments must be separated from other tokens by white space characters";
            onError(token, "MISSING_CHAR", message);
          }
          length += token.source.length;
          comment = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message);
          length += token.source.length;
          break;
        default: {
          const message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          const ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent, chomp, comment, length };
  }
  function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
    const lines = [line0];
    for (let i = 1;i < split.length; i += 2)
      lines.push([split[i], split[i + 1]]);
    return lines;
  }
  exports2.resolveBlockScalar = resolveBlockScalar;
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS(function(exports2) {
  var Scalar = require_Scalar();
  var resolveEnd = require_resolve_end();
  function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
      case "scalar":
        _type = Scalar.Scalar.PLAIN;
        value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_SINGLE;
        value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_DOUBLE;
        value = doubleQuotedValue(source, _onError);
        break;
      default:
        onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
        return {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type,
      comment: re.comment,
      range: [offset, valueEnd, re.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      case "\t":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return foldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function foldLines(source) {
    let first, line;
    try {
      first = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy");
      line = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
    } catch {
      first = /(.*?)[ \t]*\r?\n/sy;
      line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
      return source;
    let res = match[1];
    let sep = " ";
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while (match = line.exec(source)) {
      if (match[1] === "") {
        if (sep === `
`)
          res += sep;
        else
          sep = `
`;
      } else {
        res += sep + match[1];
        sep = " ";
      }
      pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i = 1;i < source.length - 1; ++i) {
      const ch = source[i];
      if (ch === "\r" && source[i + 1] === `
`)
        continue;
      if (ch === `
`) {
        const { fold, offset } = foldNewline(source, i);
        res += fold;
        i = offset;
      } else if (ch === "\\") {
        let next = source[++i];
        const cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === `
`) {
          next = source[i + 1];
          while (next === " " || next === "\t")
            next = source[++i + 1];
        } else if (next === "\r" && source[i + 1] === `
`) {
          next = source[++i + 1];
          while (next === " " || next === "\t")
            next = source[++i + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          const length = { x: 2, u: 4, U: 8 }[next];
          res += parseCharCode(source, i + 1, length, onError);
          i += length;
        } else {
          const raw = source.substr(i - 1, 2);
          onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
          res += raw;
        }
      } else if (ch === " " || ch === "\t") {
        const wsStart = i;
        let next = source[i + 1];
        while (next === " " || next === "\t")
          next = source[++i + 1];
        if (next !== `
` && !(next === "\r" && source[i + 2] === `
`))
          res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
      } else {
        res += ch;
      }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "";
    let ch = source[offset + 1];
    while (ch === " " || ch === "\t" || ch === `
` || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== `
`)
        break;
      if (ch === `
`)
        fold += `
`;
      offset += 1;
      ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  var escapeCodes = {
    "0": "\x00",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    N: "",
    _: " ",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "\t": "\t"
  };
  function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
      const raw = source.substr(offset - 2, length + 2);
      onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
      return raw;
    }
    return String.fromCodePoint(code);
  }
  exports2.resolveFlowScalar = resolveFlowScalar;
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS(function(exports2) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var resolveBlockScalar = require_resolve_block_scalar();
  var resolveFlowScalar = require_resolve_flow_scalar();
  function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
    let tag;
    if (ctx.options.stringKeys && ctx.atKey) {
      tag = ctx.schema[identity.SCALAR];
    } else if (tagName)
      tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
    else if (token.type === "scalar")
      tag = findScalarTagByTest(ctx, value, token, onError);
    else
      tag = ctx.schema[identity.SCALAR];
    let scalar;
    try {
      const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
      scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment)
      scalar.comment = comment;
    return scalar;
  }
  function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema[identity.SCALAR];
    const matchWithTest = [];
    for (const tag of schema.tags) {
      if (!tag.collection && tag.tag === tagName) {
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
      }
    }
    for (const tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
      schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
      return kt;
    }
    onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
    return schema[identity.SCALAR];
  }
  function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
    const tag = schema.tags.find((tag) => (tag.default === true || atKey && tag.default === "key") && tag.test?.test(value)) || schema[identity.SCALAR];
    if (schema.compat) {
      const compat = schema.compat.find((tag) => tag.default && tag.test?.test(value)) ?? schema[identity.SCALAR];
      if (tag.tag !== compat.tag) {
        const ts = directives.tagString(tag.tag);
        const cs = directives.tagString(compat.tag);
        const msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, true);
      }
    }
    return tag;
  }
  exports2.composeScalar = composeScalar;
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS(function(exports2) {
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      pos ?? (pos = before.length);
      for (let i = pos - 1;i >= 0; --i) {
        let st = before[i];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i];
        while (st?.type === "space") {
          offset += st.source.length;
          st = before[++i];
        }
        break;
      }
    }
    return offset;
  }
  exports2.emptyScalarPosition = emptyScalarPosition;
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS(function(exports2) {
  var Alias = require_Alias();
  var identity = require_identity();
  var composeCollection = require_compose_collection();
  var composeScalar = require_compose_scalar();
  var resolveEnd = require_resolve_end();
  var utilEmptyScalarPosition = require_util_empty_scalar_position();
  var CN = { composeNode, composeEmptyNode };
  function composeNode(ctx, token, props, onError) {
    const atKey = ctx.atKey;
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    let isSrcToken = true;
    switch (token.type) {
      case "alias":
        node = composeAlias(ctx, token, onError);
        if (anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        node = composeScalar.composeScalar(ctx, token, tag, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        node = composeCollection.composeCollection(CN, ctx, token, props, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      default: {
        const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message);
        node = composeEmptyNode(ctx, token.offset, undefined, null, props, onError);
        isSrcToken = false;
      }
    }
    if (anchor && node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
      const msg = "With stringKeys, all keys must be strings";
      onError(tag ?? token, "NON_STRING_KEY", msg);
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      if (token.type === "scalar" && token.source === "")
        node.comment = comment;
      else
        node.commentBefore = comment;
    }
    if (ctx.options.keepSourceTokens && isSrcToken)
      node.srcToken = token;
    return node;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    const token = {
      type: "scalar",
      offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    };
    const node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
      node.anchor = anchor.source.substring(1);
      if (node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      node.comment = comment;
      node.range[2] = end;
    }
    return node;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias.Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
      alias.comment = re.comment;
    return alias;
  }
  exports2.composeEmptyNode = composeEmptyNode;
  exports2.composeNode = composeNode;
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS(function(exports2) {
  var Document = require_Document();
  var composeNode = require_compose_node();
  var resolveEnd = require_resolve_end();
  var resolveProps = require_resolve_props();
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document.Document(undefined, opts);
    const ctx = {
      atKey: false,
      atRoot: true,
      directives: doc.directives,
      options: doc.options,
      schema: doc.schema
    };
    const props = resolveProps.resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      parentIndent: 0,
      startOnNewline: true
    });
    if (props.found) {
      doc.directives.docStart = true;
      if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
      doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
  }
  exports2.composeDoc = composeDoc;
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS(function(exports2) {
  var node_process = require("process");
  var directives = require_directives();
  var Document = require_Document();
  var errors = require_errors();
  var identity = require_identity();
  var composeDoc = require_compose_doc();
  var resolveEnd = require_resolve_end();
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment = "";
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0;i < prelude.length; ++i) {
      const source = prelude[i];
      switch (source[0]) {
        case "#":
          comment += (comment === "" ? "" : afterEmptyLine ? `

` : `
`) + (source.substring(1) || " ");
          atComment = true;
          afterEmptyLine = false;
          break;
        case "%":
          if (prelude[i + 1]?.[0] !== "#")
            i += 1;
          atComment = false;
          break;
        default:
          if (!atComment)
            afterEmptyLine = true;
          atComment = false;
      }
    }
    return { comment, afterEmptyLine };
  }

  class Composer {
    constructor(options = {}) {
      this.doc = null;
      this.atDirectives = false;
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
      this.onError = (source, code, message, warning) => {
        const pos = getErrorPos(source);
        if (warning)
          this.warnings.push(new errors.YAMLWarning(pos, code, message));
        else
          this.errors.push(new errors.YAMLParseError(pos, code, message));
      };
      this.directives = new directives.Directives({ version: options.version || "1.2" });
      this.options = options;
    }
    decorate(doc, afterDoc) {
      const { comment, afterEmptyLine } = parsePrelude(this.prelude);
      if (comment) {
        const dc = doc.contents;
        if (afterDoc) {
          doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
        } else if (afterEmptyLine || doc.directives.docStart || !dc) {
          doc.commentBefore = comment;
        } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
          let it = dc.items[0];
          if (identity.isPair(it))
            it = it.key;
          const cb = it.commentBefore;
          it.commentBefore = cb ? `${comment}
${cb}` : comment;
        } else {
          const cb = dc.commentBefore;
          dc.commentBefore = cb ? `${comment}
${cb}` : comment;
        }
      }
      if (afterDoc) {
        Array.prototype.push.apply(doc.errors, this.errors);
        Array.prototype.push.apply(doc.warnings, this.warnings);
      } else {
        doc.errors = this.errors;
        doc.warnings = this.warnings;
      }
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
    }
    streamInfo() {
      return {
        comment: parsePrelude(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      };
    }
    *compose(tokens, forceDoc = false, endOffset = -1) {
      for (const token of tokens)
        yield* this.next(token);
      yield* this.end(forceDoc, endOffset);
    }
    *next(token) {
      if (node_process.env.LOG_STREAM)
        console.dir(token, { depth: null });
      switch (token.type) {
        case "directive":
          this.directives.add(token.source, (offset, message, warning) => {
            const pos = getErrorPos(token);
            pos[0] += offset;
            this.onError(pos, "BAD_DIRECTIVE", message, warning);
          });
          this.prelude.push(token.source);
          this.atDirectives = true;
          break;
        case "document": {
          const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
          if (this.atDirectives && !doc.directives.docStart)
            this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          this.decorate(doc, false);
          if (this.doc)
            yield this.doc;
          this.doc = doc;
          this.atDirectives = false;
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(token.source);
          break;
        case "error": {
          const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
          const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
          if (this.atDirectives || !this.doc)
            this.errors.push(error);
          else
            this.doc.errors.push(error);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            const msg = "Unexpected doc-end without preceding document";
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
            break;
          }
          this.doc.directives.docEnd = true;
          const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
          this.decorate(this.doc, true);
          if (end.comment) {
            const dc = this.doc.comment;
            this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
          }
          this.doc.range[2] = end.offset;
          break;
        }
        default:
          this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
      }
    }
    *end(forceDoc = false, endOffset = -1) {
      if (this.doc) {
        this.decorate(this.doc, true);
        yield this.doc;
        this.doc = null;
      } else if (forceDoc) {
        const opts = Object.assign({ _directives: this.directives }, this.options);
        const doc = new Document.Document(undefined, opts);
        if (this.atDirectives)
          this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
        doc.range = [0, endOffset, endOffset];
        this.decorate(doc, false);
        yield doc;
      }
    }
  }
  exports2.Composer = Composer;
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS(function(exports2) {
  var resolveBlockScalar = require_resolve_block_scalar();
  var resolveFlowScalar = require_resolve_flow_scalar();
  var errors = require_errors();
  var stringifyString = require_stringifyString();
  function resolveAsScalar(token, strict = true, onError) {
    if (token) {
      const _onError = (pos, code, message) => {
        const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
        if (onError)
          onError(offset, code, message);
        else
          throw new errors.YAMLParseError([offset, offset + 1], code, message);
      };
      switch (token.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
        case "block-scalar":
          return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
      }
    }
    return null;
  }
  function createScalarToken(value, context) {
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
    const source = stringifyString.stringifyString({ type, value }, {
      implicitKey,
      indent: indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    const end = context.end ?? [
      { type: "newline", offset: -1, indent, source: `
` }
    ];
    switch (source[0]) {
      case "|":
      case ">": {
        const he = source.indexOf(`
`);
        const head = source.substring(0, he);
        const body = source.substring(he + 1) + `
`;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, end))
          props.push({ type: "newline", offset: -1, indent, source: `
` });
        return { type: "block-scalar", offset, indent, props, source: body };
      }
      case '"':
        return { type: "double-quoted-scalar", offset, indent, source, end };
      case "'":
        return { type: "single-quoted-scalar", offset, indent, source, end };
      default:
        return { type: "scalar", offset, indent, source, end };
    }
  }
  function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = "indent" in token ? token.indent : null;
    if (afterKey && typeof indent === "number")
      indent += 2;
    if (!type)
      switch (token.type) {
        case "single-quoted-scalar":
          type = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          type = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          const header = token.props[0];
          if (header.type !== "block-scalar-header")
            throw new Error("Invalid block scalar header");
          type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          type = "PLAIN";
      }
    const source = stringifyString.stringifyString({ type, value }, {
      implicitKey: implicitKey || indent === null,
      indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
      case "|":
      case ">":
        setBlockScalarValue(token, source);
        break;
      case '"':
        setFlowScalarValue(token, source, "double-quoted-scalar");
        break;
      case "'":
        setFlowScalarValue(token, source, "single-quoted-scalar");
        break;
      default:
        setFlowScalarValue(token, source, "scalar");
    }
  }
  function setBlockScalarValue(token, source) {
    const he = source.indexOf(`
`);
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + `
`;
    if (token.type === "block-scalar") {
      const header = token.props[0];
      if (header.type !== "block-scalar-header")
        throw new Error("Invalid block scalar header");
      header.source = head;
      token.source = body;
    } else {
      const { offset } = token;
      const indent = "indent" in token ? token.indent : -1;
      const props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, "end" in token ? token.end : undefined))
        props.push({ type: "newline", offset: -1, indent, source: `
` });
      for (const key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type: "block-scalar", indent, props, source: body });
    }
  }
  function addEndtoBlockProps(props, end) {
    if (end)
      for (const st of end)
        switch (st.type) {
          case "space":
          case "comment":
            props.push(st);
            break;
          case "newline":
            props.push(st);
            return true;
        }
    return false;
  }
  function setFlowScalarValue(token, source, type) {
    switch (token.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        token.type = type;
        token.source = source;
        break;
      case "block-scalar": {
        const end = token.props.slice(1);
        let oa = source.length;
        if (token.props[0].type === "block-scalar-header")
          oa -= token.props[0].source.length;
        for (const tok of end)
          tok.offset += oa;
        delete token.props;
        Object.assign(token, { type, source, end });
        break;
      }
      case "block-map":
      case "block-seq": {
        const offset = token.offset + source.length;
        const nl = { type: "newline", offset, indent: token.indent, source: `
` };
        delete token.items;
        Object.assign(token, { type, source, end: [nl] });
        break;
      }
      default: {
        const indent = "indent" in token ? token.indent : -1;
        const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type, indent, source, end });
      }
    }
  }
  exports2.createScalarToken = createScalarToken;
  exports2.resolveAsScalar = resolveAsScalar;
  exports2.setScalarValue = setScalarValue;
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS(function(exports2) {
  var stringify = (cst) => ("type" in cst) ? stringifyToken(cst) : stringifyItem(cst);
  function stringifyToken(token) {
    switch (token.type) {
      case "block-scalar": {
        let res = "";
        for (const tok of token.props)
          res += stringifyToken(tok);
        return res + token.source;
      }
      case "block-map":
      case "block-seq": {
        let res = "";
        for (const item of token.items)
          res += stringifyItem(item);
        return res;
      }
      case "flow-collection": {
        let res = token.start.source;
        for (const item of token.items)
          res += stringifyItem(item);
        for (const st of token.end)
          res += st.source;
        return res;
      }
      case "document": {
        let res = stringifyItem(token);
        if (token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
      default: {
        let res = token.source;
        if ("end" in token && token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
    }
  }
  function stringifyItem({ start, key, sep, value }) {
    let res = "";
    for (const st of start)
      res += st.source;
    if (key)
      res += stringifyToken(key);
    if (sep)
      for (const st of sep)
        res += st.source;
    if (value)
      res += stringifyToken(value);
    return res;
  }
  exports2.stringify = stringify;
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS(function(exports2) {
  var BREAK = Symbol("break visit");
  var SKIP = Symbol("skip children");
  var REMOVE = Symbol("remove item");
  function visit(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  visit.BREAK = BREAK;
  visit.SKIP = SKIP;
  visit.REMOVE = REMOVE;
  visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
      const tok = item?.[field];
      if (tok && "items" in tok) {
        item = tok.items[index];
      } else
        return;
    }
    return item;
  };
  visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent?.[field];
    if (coll && "items" in coll)
      return coll;
    throw new Error("Parent collection not found");
  };
  function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (const field of ["key", "value"]) {
      const token = item[field];
      if (token && "items" in token) {
        for (let i = 0;i < token.items.length; ++i) {
          const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            token.items.splice(i, 1);
            i -= 1;
          }
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
  }
  exports2.visit = visit;
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS(function(exports2) {
  var cstScalar = require_cst_scalar();
  var cstStringify = require_cst_stringify();
  var cstVisit = require_cst_visit();
  var BOM = "\uFEFF";
  var DOCUMENT = "\x02";
  var FLOW_END = "\x18";
  var SCALAR = "\x1F";
  var isCollection = (token) => !!token && ("items" in token);
  var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
  function prettyToken(token) {
    switch (token) {
      case BOM:
        return "<BOM>";
      case DOCUMENT:
        return "<DOC>";
      case FLOW_END:
        return "<FLOW_END>";
      case SCALAR:
        return "<SCALAR>";
      default:
        return JSON.stringify(token);
    }
  }
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "\t":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  exports2.createScalarToken = cstScalar.createScalarToken;
  exports2.resolveAsScalar = cstScalar.resolveAsScalar;
  exports2.setScalarValue = cstScalar.setScalarValue;
  exports2.stringify = cstStringify.stringify;
  exports2.visit = cstVisit.visit;
  exports2.BOM = BOM;
  exports2.DOCUMENT = DOCUMENT;
  exports2.FLOW_END = FLOW_END;
  exports2.SCALAR = SCALAR;
  exports2.isCollection = isCollection;
  exports2.isScalar = isScalar;
  exports2.prettyToken = prettyToken;
  exports2.tokenType = tokenType;
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS(function(exports2) {
  var cst = require_cst();
  function isEmpty(ch) {
    switch (ch) {
      case undefined:
      case " ":
      case `
`:
      case "\r":
      case "\t":
        return true;
      default:
        return false;
    }
  }
  var hexDigits = new Set("0123456789ABCDEFabcdef");
  var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
  var flowIndicatorChars = new Set(",[]{}");
  var invalidAnchorChars = new Set(` ,[]{}
\r	`);
  var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);

  class Lexer {
    constructor() {
      this.atEnd = false;
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      this.buffer = "";
      this.flowKey = false;
      this.flowLevel = 0;
      this.indentNext = 0;
      this.indentValue = 0;
      this.lineEndPos = null;
      this.next = null;
      this.pos = 0;
    }
    *lex(source, incomplete = false) {
      if (source) {
        if (typeof source !== "string")
          throw TypeError("source is not a string");
        this.buffer = this.buffer ? this.buffer + source : source;
        this.lineEndPos = null;
      }
      this.atEnd = !incomplete;
      let next = this.next ?? "stream";
      while (next && (incomplete || this.hasChars(1)))
        next = yield* this.parseNext(next);
    }
    atLineEnd() {
      let i = this.pos;
      let ch = this.buffer[i];
      while (ch === " " || ch === "\t")
        ch = this.buffer[++i];
      if (!ch || ch === "#" || ch === `
`)
        return true;
      if (ch === "\r")
        return this.buffer[i + 1] === `
`;
      return false;
    }
    charAt(n) {
      return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
      let ch = this.buffer[offset];
      if (this.indentNext > 0) {
        let indent = 0;
        while (ch === " ")
          ch = this.buffer[++indent + offset];
        if (ch === "\r") {
          const next = this.buffer[indent + offset + 1];
          if (next === `
` || !next && !this.atEnd)
            return offset + indent + 1;
        }
        return ch === `
` || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
      }
      if (ch === "-" || ch === ".") {
        const dt = this.buffer.substr(offset, 3);
        if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
          return -1;
      }
      return offset;
    }
    getLine() {
      let end = this.lineEndPos;
      if (typeof end !== "number" || end !== -1 && end < this.pos) {
        end = this.buffer.indexOf(`
`, this.pos);
        this.lineEndPos = end;
      }
      if (end === -1)
        return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[end - 1] === "\r")
        end -= 1;
      return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
      return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
      this.buffer = this.buffer.substring(this.pos);
      this.pos = 0;
      this.lineEndPos = null;
      this.next = state;
      return null;
    }
    peek(n) {
      return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
      switch (next) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let line = this.getLine();
      if (line === null)
        return this.setNext("stream");
      if (line[0] === cst.BOM) {
        yield* this.pushCount(1);
        line = line.substring(1);
      }
      if (line[0] === "%") {
        let dirEnd = line.length;
        let cs = line.indexOf("#");
        while (cs !== -1) {
          const ch = line[cs - 1];
          if (ch === " " || ch === "\t") {
            dirEnd = cs - 1;
            break;
          } else {
            cs = line.indexOf("#", cs + 1);
          }
        }
        while (true) {
          const ch = line[dirEnd - 1];
          if (ch === " " || ch === "\t")
            dirEnd -= 1;
          else
            break;
        }
        const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
        yield* this.pushCount(line.length - n);
        this.pushNewline();
        return "stream";
      }
      if (this.atLineEnd()) {
        const sp = yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - sp);
        yield* this.pushNewline();
        return "stream";
      }
      yield cst.DOCUMENT;
      return yield* this.parseLineStart();
    }
    *parseLineStart() {
      const ch = this.charAt(0);
      if (!ch && !this.atEnd)
        return this.setNext("line-start");
      if (ch === "-" || ch === ".") {
        if (!this.atEnd && !this.hasChars(4))
          return this.setNext("line-start");
        const s = this.peek(3);
        if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
          yield* this.pushCount(3);
          this.indentValue = 0;
          this.indentNext = 0;
          return s === "---" ? "doc" : "stream";
        }
      }
      this.indentValue = yield* this.pushSpaces(false);
      if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      const [ch0, ch1] = this.peek(2);
      if (!ch1 && !this.atEnd)
        return this.setNext("block-start");
      if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
        const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
        this.indentNext = this.indentValue + 1;
        this.indentValue += n;
        return yield* this.parseBlockStart();
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(true);
      const line = this.getLine();
      if (line === null)
        return this.setNext("doc");
      let n = yield* this.pushIndicators();
      switch (line[n]) {
        case "#":
          yield* this.pushCount(line.length - n);
        case undefined:
          yield* this.pushNewline();
          return yield* this.parseLineStart();
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel = 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          return "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          n += yield* this.parseBlockScalarHeader();
          n += yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - n);
          yield* this.pushNewline();
          return yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let nl, sp;
      let indent = -1;
      do {
        nl = yield* this.pushNewline();
        if (nl > 0) {
          sp = yield* this.pushSpaces(false);
          this.indentValue = indent = sp;
        } else {
          sp = 0;
        }
        sp += yield* this.pushSpaces(true);
      } while (nl + sp > 0);
      const line = this.getLine();
      if (line === null)
        return this.setNext("flow");
      if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
        const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
        if (!atFlowEndMarker) {
          this.flowLevel = 0;
          yield cst.FLOW_END;
          return yield* this.parseLineStart();
        }
      }
      let n = 0;
      while (line[n] === ",") {
        n += yield* this.pushCount(1);
        n += yield* this.pushSpaces(true);
        this.flowKey = false;
      }
      n += yield* this.pushIndicators();
      switch (line[n]) {
        case undefined:
          return "flow";
        case "#":
          yield* this.pushCount(line.length - n);
          return "flow";
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel += 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          this.flowKey = true;
          this.flowLevel -= 1;
          return this.flowLevel ? "flow" : "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "flow";
        case '"':
        case "'":
          this.flowKey = true;
          return yield* this.parseQuotedScalar();
        case ":": {
          const next = this.charAt(1);
          if (this.flowKey || isEmpty(next) || next === ",") {
            this.flowKey = false;
            yield* this.pushCount(1);
            yield* this.pushSpaces(true);
            return "flow";
          }
        }
        default:
          this.flowKey = false;
          return yield* this.parsePlainScalar();
      }
    }
    *parseQuotedScalar() {
      const quote = this.charAt(0);
      let end = this.buffer.indexOf(quote, this.pos + 1);
      if (quote === "'") {
        while (end !== -1 && this.buffer[end + 1] === "'")
          end = this.buffer.indexOf("'", end + 2);
      } else {
        while (end !== -1) {
          let n = 0;
          while (this.buffer[end - 1 - n] === "\\")
            n += 1;
          if (n % 2 === 0)
            break;
          end = this.buffer.indexOf('"', end + 1);
        }
      }
      const qb = this.buffer.substring(0, end);
      let nl = qb.indexOf(`
`, this.pos);
      if (nl !== -1) {
        while (nl !== -1) {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = qb.indexOf(`
`, cs);
        }
        if (nl !== -1) {
          end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
        }
      }
      if (end === -1) {
        if (!this.atEnd)
          return this.setNext("quoted-scalar");
        end = this.buffer.length;
      }
      yield* this.pushToIndex(end + 1, false);
      return this.flowLevel ? "flow" : "doc";
    }
    *parseBlockScalarHeader() {
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      let i = this.pos;
      while (true) {
        const ch = this.buffer[++i];
        if (ch === "+")
          this.blockScalarKeep = true;
        else if (ch > "0" && ch <= "9")
          this.blockScalarIndent = Number(ch) - 1;
        else if (ch !== "-")
          break;
      }
      return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
    }
    *parseBlockScalar() {
      let nl = this.pos - 1;
      let indent = 0;
      let ch;
      loop:
        for (let i = this.pos;ch = this.buffer[i]; ++i) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case `
`:
              nl = i;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === `
`)
                break;
            }
            default:
              break loop;
          }
        }
      if (!ch && !this.atEnd)
        return this.setNext("block-scalar");
      if (indent >= this.indentNext) {
        if (this.blockScalarIndent === -1)
          this.indentNext = indent;
        else {
          this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
        }
        do {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = this.buffer.indexOf(`
`, cs);
        } while (nl !== -1);
        if (nl === -1) {
          if (!this.atEnd)
            return this.setNext("block-scalar");
          nl = this.buffer.length;
        }
      }
      let i = nl + 1;
      ch = this.buffer[i];
      while (ch === " ")
        ch = this.buffer[++i];
      if (ch === "\t") {
        while (ch === "\t" || ch === " " || ch === "\r" || ch === `
`)
          ch = this.buffer[++i];
        nl = i - 1;
      } else if (!this.blockScalarKeep) {
        do {
          let i = nl - 1;
          let ch = this.buffer[i];
          if (ch === "\r")
            ch = this.buffer[--i];
          const lastChar = i;
          while (ch === " ")
            ch = this.buffer[--i];
          if (ch === `
` && i >= this.pos && i + 1 + indent > lastChar)
            nl = i;
          else
            break;
        } while (true);
      }
      yield cst.SCALAR;
      yield* this.pushToIndex(nl + 1, true);
      return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
      const inFlow = this.flowLevel > 0;
      let end = this.pos - 1;
      let i = this.pos - 1;
      let ch;
      while (ch = this.buffer[++i]) {
        if (ch === ":") {
          const next = this.buffer[i + 1];
          if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
            break;
          end = i;
        } else if (isEmpty(ch)) {
          let next = this.buffer[i + 1];
          if (ch === "\r") {
            if (next === `
`) {
              i += 1;
              ch = `
`;
              next = this.buffer[i + 1];
            } else
              end = i;
          }
          if (next === "#" || inFlow && flowIndicatorChars.has(next))
            break;
          if (ch === `
`) {
            const cs = this.continueScalar(i + 1);
            if (cs === -1)
              break;
            i = Math.max(i, cs - 2);
          }
        } else {
          if (inFlow && flowIndicatorChars.has(ch))
            break;
          end = i;
        }
      }
      if (!ch && !this.atEnd)
        return this.setNext("plain-scalar");
      yield cst.SCALAR;
      yield* this.pushToIndex(end + 1, true);
      return inFlow ? "flow" : "doc";
    }
    *pushCount(n) {
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos += n;
        return n;
      }
      return 0;
    }
    *pushToIndex(i, allowEmpty) {
      const s = this.buffer.slice(this.pos, i);
      if (s) {
        yield s;
        this.pos += s.length;
        return s.length;
      } else if (allowEmpty)
        yield "";
      return 0;
    }
    *pushIndicators() {
      switch (this.charAt(0)) {
        case "!":
          return (yield* this.pushTag()) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
        case "&":
          return (yield* this.pushUntil(isNotAnchorChar)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
        case "-":
        case "?":
        case ":": {
          const inFlow = this.flowLevel > 0;
          const ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = false;
            return (yield* this.pushCount(1)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
          }
        }
      }
      return 0;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let i = this.pos + 2;
        let ch = this.buffer[i];
        while (!isEmpty(ch) && ch !== ">")
          ch = this.buffer[++i];
        return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
      } else {
        let i = this.pos + 1;
        let ch = this.buffer[i];
        while (ch) {
          if (tagChars.has(ch))
            ch = this.buffer[++i];
          else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
            ch = this.buffer[i += 3];
          } else
            break;
        }
        return yield* this.pushToIndex(i, false);
      }
    }
    *pushNewline() {
      const ch = this.buffer[this.pos];
      if (ch === `
`)
        return yield* this.pushCount(1);
      else if (ch === "\r" && this.charAt(1) === `
`)
        return yield* this.pushCount(2);
      else
        return 0;
    }
    *pushSpaces(allowTabs) {
      let i = this.pos - 1;
      let ch;
      do {
        ch = this.buffer[++i];
      } while (ch === " " || allowTabs && ch === "\t");
      const n = i - this.pos;
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos = i;
      }
      return n;
    }
    *pushUntil(test) {
      let i = this.pos;
      let ch = this.buffer[i];
      while (!test(ch))
        ch = this.buffer[++i];
      return yield* this.pushToIndex(i, false);
    }
  }
  exports2.Lexer = Lexer;
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS(function(exports2) {
  class LineCounter {
    constructor() {
      this.lineStarts = [];
      this.addNewLine = (offset) => this.lineStarts.push(offset);
      this.linePos = (offset) => {
        let low = 0;
        let high = this.lineStarts.length;
        while (low < high) {
          const mid = low + high >> 1;
          if (this.lineStarts[mid] < offset)
            low = mid + 1;
          else
            high = mid;
        }
        if (this.lineStarts[low] === offset)
          return { line: low + 1, col: 1 };
        if (low === 0)
          return { line: 0, col: offset };
        const start = this.lineStarts[low - 1];
        return { line: low, col: offset - start + 1 };
      };
    }
  }
  exports2.LineCounter = LineCounter;
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS(function(exports2) {
  var node_process = require("process");
  var cst = require_cst();
  var lexer = require_lexer();
  function includesToken(list, type) {
    for (let i = 0;i < list.length; ++i)
      if (list[i].type === type)
        return true;
    return false;
  }
  function findNonEmptyIndex(list) {
    for (let i = 0;i < list.length; ++i) {
      switch (list[i].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i;
      }
    }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return true;
      default:
        return false;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        const it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i = prev.length;
    loop:
      while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
    while (prev[++i]?.type === "space") {}
    return prev.splice(i, prev.length);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (const it of fc.items) {
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          delete it.key;
          if (isFlowToken(it.value)) {
            if (it.value.end)
              Array.prototype.push.apply(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          } else
            Array.prototype.push.apply(it.start, it.sep);
          delete it.sep;
        }
      }
    }
  }

  class Parser {
    constructor(onNewLine) {
      this.atNewLine = true;
      this.atScalar = false;
      this.indent = 0;
      this.offset = 0;
      this.onKeyLine = false;
      this.stack = [];
      this.source = "";
      this.type = "";
      this.lexer = new lexer.Lexer;
      this.onNewLine = onNewLine;
    }
    *parse(source, incomplete = false) {
      if (this.onNewLine && this.offset === 0)
        this.onNewLine(0);
      for (const lexeme of this.lexer.lex(source, incomplete))
        yield* this.next(lexeme);
      if (!incomplete)
        yield* this.end();
    }
    *next(source) {
      this.source = source;
      if (node_process.env.LOG_TOKENS)
        console.log("|", cst.prettyToken(source));
      if (this.atScalar) {
        this.atScalar = false;
        yield* this.step();
        this.offset += source.length;
        return;
      }
      const type = cst.tokenType(source);
      if (!type) {
        const message = `Not a YAML token: ${source}`;
        yield* this.pop({ type: "error", offset: this.offset, message, source });
        this.offset += source.length;
      } else if (type === "scalar") {
        this.atNewLine = false;
        this.atScalar = true;
        this.type = "scalar";
      } else {
        this.type = type;
        yield* this.step();
        switch (type) {
          case "newline":
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine)
              this.onNewLine(this.offset + source.length);
            break;
          case "space":
            if (this.atNewLine && source[0] === " ")
              this.indent += source.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine)
              this.indent += source.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = false;
        }
        this.offset += source.length;
      }
    }
    *end() {
      while (this.stack.length > 0)
        yield* this.pop();
    }
    get sourceToken() {
      const st = {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
      return st;
    }
    *step() {
      const top = this.peek(1);
      if (this.type === "doc-end" && top?.type !== "doc-end") {
        while (this.stack.length > 0)
          yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source
        });
        return;
      }
      if (!top)
        return yield* this.stream();
      switch (top.type) {
        case "document":
          return yield* this.document(top);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(top);
        case "block-scalar":
          return yield* this.blockScalar(top);
        case "block-map":
          return yield* this.blockMap(top);
        case "block-seq":
          return yield* this.blockSequence(top);
        case "flow-collection":
          return yield* this.flowCollection(top);
        case "doc-end":
          return yield* this.documentEnd(top);
      }
      yield* this.pop();
    }
    peek(n) {
      return this.stack[this.stack.length - n];
    }
    *pop(error) {
      const token = error ?? this.stack.pop();
      if (!token) {
        const message = "Tried to pop an empty stack";
        yield { type: "error", offset: this.offset, source: "", message };
      } else if (this.stack.length === 0) {
        yield token;
      } else {
        const top = this.peek(1);
        if (token.type === "block-scalar") {
          token.indent = "indent" in top ? top.indent : 0;
        } else if (token.type === "flow-collection" && top.type === "document") {
          token.indent = 0;
        }
        if (token.type === "flow-collection")
          fixFlowSeqItems(token);
        switch (top.type) {
          case "document":
            top.value = token;
            break;
          case "block-scalar":
            top.props.push(token);
            break;
          case "block-map": {
            const it = top.items[top.items.length - 1];
            if (it.value) {
              top.items.push({ start: [], key: token, sep: [] });
              this.onKeyLine = true;
              return;
            } else if (it.sep) {
              it.value = token;
            } else {
              Object.assign(it, { key: token, sep: [] });
              this.onKeyLine = !it.explicitKey;
              return;
            }
            break;
          }
          case "block-seq": {
            const it = top.items[top.items.length - 1];
            if (it.value)
              top.items.push({ start: [], value: token });
            else
              it.value = token;
            break;
          }
          case "flow-collection": {
            const it = top.items[top.items.length - 1];
            if (!it || it.value)
              top.items.push({ start: [], key: token, sep: [] });
            else if (it.sep)
              it.value = token;
            else
              Object.assign(it, { key: token, sep: [] });
            return;
          }
          default:
            yield* this.pop();
            yield* this.pop(token);
        }
        if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
          const last = token.items[token.items.length - 1];
          if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
            if (top.type === "document")
              top.end = last.start;
            else
              top.items.push({ start: last.start });
            token.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          const doc = {
            type: "document",
            offset: this.offset,
            start: []
          };
          if (this.type === "doc-start")
            doc.start.push(this.sourceToken);
          this.stack.push(doc);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source
      };
    }
    *document(doc) {
      if (doc.value)
        return yield* this.lineEnd(doc);
      switch (this.type) {
        case "doc-start": {
          if (findNonEmptyIndex(doc.start) !== -1) {
            yield* this.pop();
            yield* this.step();
          } else
            doc.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          doc.start.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(doc);
      if (bv)
        this.stack.push(bv);
      else {
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
      }
    }
    *scalar(scalar) {
      if (this.type === "map-value-ind") {
        const prev = getPrevProps(this.peek(2));
        const start = getFirstKeyStartProps(prev);
        let sep;
        if (scalar.end) {
          sep = scalar.end;
          sep.push(this.sourceToken);
          delete scalar.end;
        } else
          sep = [this.sourceToken];
        const map = {
          type: "block-map",
          offset: scalar.offset,
          indent: scalar.indent,
          items: [{ start, key: scalar, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map;
      } else
        yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          scalar.props.push(this.sourceToken);
          return;
        case "scalar":
          scalar.source = this.source;
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine) {
            let nl = this.source.indexOf(`
`) + 1;
            while (nl !== 0) {
              this.onNewLine(this.offset + nl);
              nl = this.source.indexOf(`
`, nl) + 1;
            }
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop();
          yield* this.step();
      }
    }
    *blockMap(map) {
      const it = map.items[map.items.length - 1];
      switch (this.type) {
        case "newline":
          this.onKeyLine = false;
          if (it.value) {
            const end = "end" in it.value ? it.value.end : undefined;
            const last = Array.isArray(end) ? end[end.length - 1] : undefined;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              map.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "space":
        case "comment":
          if (it.value) {
            map.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            if (this.atIndentedComment(it.start, map.indent)) {
              const prev = map.items[map.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start);
                end.push(this.sourceToken);
                map.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= map.indent) {
        const atMapIndent = !this.onKeyLine && this.indent === map.indent;
        const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
        let start = [];
        if (atNextItem && it.sep && !it.value) {
          const nl = [];
          for (let i = 0;i < it.sep.length; ++i) {
            const st = it.sep[i];
            switch (st.type) {
              case "newline":
                nl.push(i);
                break;
              case "space":
                break;
              case "comment":
                if (st.indent > map.indent)
                  nl.length = 0;
                break;
              default:
                nl.length = 0;
            }
          }
          if (nl.length >= 2)
            start = it.sep.splice(nl[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map.items.push({ start });
              this.onKeyLine = true;
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "explicit-key-ind":
            if (!it.sep && !it.explicitKey) {
              it.start.push(this.sourceToken);
              it.explicitKey = true;
            } else if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map.items.push({ start, explicitKey: true });
            } else {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: true }]
              });
            }
            this.onKeyLine = true;
            return;
          case "map-value-ind":
            if (it.explicitKey) {
              if (!it.sep) {
                if (includesToken(it.start, "newline")) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else {
                  const start = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                }
              } else if (it.value) {
                map.items.push({ start: [], key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key: null, sep: [this.sourceToken] }]
                });
              } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                const start = getFirstKeyStartProps(it.start);
                const key = it.key;
                const sep = it.sep;
                sep.push(this.sourceToken);
                delete it.key;
                delete it.sep;
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key, sep }]
                });
              } else if (start.length > 0) {
                it.sep = it.sep.concat(start, this.sourceToken);
              } else {
                it.sep.push(this.sourceToken);
              }
            } else {
              if (!it.sep) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else if (it.value || atNextItem) {
                map.items.push({ start, key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [], key: null, sep: [this.sourceToken] }]
                });
              } else {
                it.sep.push(this.sourceToken);
              }
            }
            this.onKeyLine = true;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (atNextItem || it.value) {
              map.items.push({ start, key: fs, sep: [] });
              this.onKeyLine = true;
            } else if (it.sep) {
              this.stack.push(fs);
            } else {
              Object.assign(it, { key: fs, sep: [] });
              this.onKeyLine = true;
            }
            return;
          }
          default: {
            const bv = this.startBlockValue(map);
            if (bv) {
              if (bv.type === "block-seq") {
                if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source
                  });
                  return;
                }
              } else if (atMapIndent) {
                map.items.push({ start });
              }
              this.stack.push(bv);
              return;
            }
          }
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *blockSequence(seq) {
      const it = seq.items[seq.items.length - 1];
      switch (this.type) {
        case "newline":
          if (it.value) {
            const end = "end" in it.value ? it.value.end : undefined;
            const last = Array.isArray(end) ? end[end.length - 1] : undefined;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              seq.items.push({ start: [this.sourceToken] });
          } else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            seq.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(it.start, seq.indent)) {
              const prev = seq.items[seq.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                Array.prototype.push.apply(end, it.start);
                end.push(this.sourceToken);
                seq.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (it.value || this.indent <= seq.indent)
            break;
          it.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== seq.indent)
            break;
          if (it.value || includesToken(it.start, "seq-item-ind"))
            seq.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
      }
      if (this.indent > seq.indent) {
        const bv = this.startBlockValue(seq);
        if (bv) {
          this.stack.push(bv);
          return;
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *flowCollection(fc) {
      const it = fc.items[fc.items.length - 1];
      if (this.type === "flow-error-end") {
        let top;
        do {
          yield* this.pop();
          top = this.peek(1);
        } while (top?.type === "flow-collection");
      } else if (fc.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!it || it.sep)
              fc.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!it || it.value)
              fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!it || it.value)
              fc.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (!it || it.value)
              fc.items.push({ start: [], key: fs, sep: [] });
            else if (it.sep)
              this.stack.push(fs);
            else
              Object.assign(it, { key: fs, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            fc.end.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(fc);
        if (bv)
          this.stack.push(bv);
        else {
          yield* this.pop();
          yield* this.step();
        }
      } else {
        const parent = this.peek(2);
        if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
          yield* this.pop();
          yield* this.step();
        } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          fixFlowSeqItems(fc);
          const sep = fc.end.splice(1, fc.end.length);
          sep.push(this.sourceToken);
          const map = {
            type: "block-map",
            offset: fc.offset,
            indent: fc.indent,
            items: [{ start, key: fc, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else {
          yield* this.lineEnd(fc);
        }
      }
    }
    flowScalar(type) {
      if (this.onNewLine) {
        let nl = this.source.indexOf(`
`) + 1;
        while (nl !== 0) {
          this.onNewLine(this.offset + nl);
          nl = this.source.indexOf(`
`, nl) + 1;
        }
      }
      return {
        type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    startBlockValue(parent) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: ""
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: []
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }]
          };
        case "explicit-key-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          start.push(this.sourceToken);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, explicitKey: true }]
          };
        }
        case "map-value-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, key: null, sep: [this.sourceToken] }]
          };
        }
      }
      return null;
    }
    atIndentedComment(start, indent) {
      if (this.type !== "comment")
        return false;
      if (this.indent <= indent)
        return false;
      return start.every((st) => st.type === "newline" || st.type === "space");
    }
    *documentEnd(docEnd) {
      if (this.type !== "doc-mode") {
        if (docEnd.end)
          docEnd.end.push(this.sourceToken);
        else
          docEnd.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
      }
    }
    *lineEnd(token) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop();
          yield* this.step();
          break;
        case "newline":
          this.onKeyLine = false;
        case "space":
        case "comment":
        default:
          if (token.end)
            token.end.push(this.sourceToken);
          else
            token.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
      }
    }
  }
  exports2.Parser = Parser;
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS(function(exports2) {
  var composer = require_composer();
  var Document = require_Document();
  var errors = require_errors();
  var log = require_log();
  var identity = require_identity();
  var lineCounter = require_line_counter();
  var parser = require_parser();
  function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter || null;
    return { lineCounter: lineCounter$1, prettyErrors };
  }
  function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    const docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter)
      for (const doc of docs) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter));
      }
    if (docs.length > 0)
      return docs;
    return Object.assign([], { empty: true }, composer$1.streamInfo());
  }
  function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    let doc = null;
    for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
      if (!doc)
        doc = _doc;
      else if (doc.options.logLevel !== "silent") {
        doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    }
    if (prettyErrors && lineCounter) {
      doc.errors.forEach(errors.prettifyError(source, lineCounter));
      doc.warnings.forEach(errors.prettifyError(source, lineCounter));
    }
    return doc;
  }
  function parse(src, reviver, options) {
    let _reviver = undefined;
    if (typeof reviver === "function") {
      _reviver = reviver;
    } else if (options === undefined && reviver && typeof reviver === "object") {
      options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
      return null;
    doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
      if (doc.options.logLevel !== "silent")
        throw doc.errors[0];
      else
        doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
  }
  function stringify(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === undefined && replacer) {
      options = replacer;
    }
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      const indent = Math.round(options);
      options = indent < 1 ? undefined : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === undefined) {
      const { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return;
    }
    if (identity.isDocument(value) && !_replacer)
      return value.toString(options);
    return new Document.Document(value, _replacer, options).toString(options);
  }
  exports2.parse = parse;
  exports2.parseAllDocuments = parseAllDocuments;
  exports2.parseDocument = parseDocument;
  exports2.stringify = stringify;
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS(function(exports2) {
  var composer = require_composer();
  var Document = require_Document();
  var Schema = require_Schema();
  var errors = require_errors();
  var Alias = require_Alias();
  var identity = require_identity();
  var Pair = require_Pair();
  var Scalar = require_Scalar();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var cst = require_cst();
  var lexer = require_lexer();
  var lineCounter = require_line_counter();
  var parser = require_parser();
  var publicApi = require_public_api();
  var visit = require_visit();
  exports2.Composer = composer.Composer;
  exports2.Document = Document.Document;
  exports2.Schema = Schema.Schema;
  exports2.YAMLError = errors.YAMLError;
  exports2.YAMLParseError = errors.YAMLParseError;
  exports2.YAMLWarning = errors.YAMLWarning;
  exports2.Alias = Alias.Alias;
  exports2.isAlias = identity.isAlias;
  exports2.isCollection = identity.isCollection;
  exports2.isDocument = identity.isDocument;
  exports2.isMap = identity.isMap;
  exports2.isNode = identity.isNode;
  exports2.isPair = identity.isPair;
  exports2.isScalar = identity.isScalar;
  exports2.isSeq = identity.isSeq;
  exports2.Pair = Pair.Pair;
  exports2.Scalar = Scalar.Scalar;
  exports2.YAMLMap = YAMLMap.YAMLMap;
  exports2.YAMLSeq = YAMLSeq.YAMLSeq;
  exports2.CST = cst;
  exports2.Lexer = lexer.Lexer;
  exports2.LineCounter = lineCounter.LineCounter;
  exports2.Parser = parser.Parser;
  exports2.parse = publicApi.parse;
  exports2.parseAllDocuments = publicApi.parseAllDocuments;
  exports2.parseDocument = publicApi.parseDocument;
  exports2.stringify = publicApi.stringify;
  exports2.visit = visit.visit;
  exports2.visitAsync = visit.visitAsync;
});

// packages/core/src/apps/blueprint/compile.ts
var exports_compile = {};
__export(exports_compile, {
  compileBlueprints: () => compileBlueprints
});
module.exports = __toCommonJS(exports_compile);
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

// node_modules/zod/v4/core/core.js
var _a;
function $constructor(name, initializer, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: new Set
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    const proto = _.prototype;
    const keys = Object.keys(proto);
    for (let i = 0;i < keys.length; i++) {
      const k = keys[i];
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return;
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = {};
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const newShape = { ...schema._zod.def.shape };
      for (const key in mask) {
        if (!(key in currDef.shape)) {
          throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      assignProp(this, "shape", newShape);
      return newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = schema._zod.def.shape;
    for (const key in shape) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    }
  });
  return clone(schema, def);
}
function merge(a, b) {
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const def = mergeDefs(a._zod.def, {
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  }
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in oldShape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      } else {
        for (const key in oldShape) {
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  const def = mergeDefs(schema._zod.def, {
    get shape() {
      const oldShape = schema._zod.def.shape;
      const shape = { ...oldShape };
      if (mask) {
        for (const key in mask) {
          if (!(key in shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      } else {
        for (const key in oldShape) {
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      }
      assignProp(this, "shape", shape);
      return shape;
    }
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}

// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error, path = []) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
  return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const time = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const timeRegex = `${time}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    var _a;
    (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 4,
  patch: 3
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      if (!def.normalize && def.protocol?.source === httpProtocol.source) {
        if (!/^https?:\/\//i.test(trimmed)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid URL format",
            input: payload.value,
            inst,
            continue: !def.abort
          });
          return;
        }
      }
      const url = new URL(trimmed);
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.normalize) {
        payload.value = url.href;
      } else {
        payload.value = trimmed;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.format = `ipv6`;
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw new Error;
      const [address, prefix] = parts;
      if (!prefix)
        throw new Error;
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error;
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error;
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64";
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.bag.contentEncoding = "base64url";
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
  const isPresent = key in input;
  if (result.issues.length) {
    if (isOptionalIn && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && !isOptionalIn) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: undefined,
        path: [key]
      });
    }
    return;
  }
  if (result.value === undefined) {
    if (isPresent) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  for (const k of keys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const isOptionalIn = _catchall.optin === "optional";
  const isOptionalOut = _catchall.optout === "optional";
  for (const key in input) {
    if (key === "__proto__")
      continue;
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
    } else {
      handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  if (!desc?.get) {
    const sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        const newSh = { ...sh };
        Object.defineProperty(def, "shape", {
          value: newSh
        });
        return newSh;
      }
    });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = new Set);
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = {};
    const proms = [];
    const shape = value.shape;
    for (const key of value.keys) {
      const el = shape[key];
      const isOptionalIn = el._zod.optin === "optional";
      const isOptionalOut = el._zod.optout === "optional";
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {};`);
    for (const key of normalized.keys) {
      const id = ids[key];
      const k = esc(key);
      const schema = shape[key];
      const isOptionalIn = schema?._zod?.optin === "optional";
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(key)};`);
      if (isOptionalIn && isOptionalOut) {
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values) {
      payload.value = {};
      const recordKeys = new Set;
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result) => {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized = unrecognized ?? [];
          unrecognized.push(key);
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized
        });
      }
    } else {
      payload.value = {};
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result) => {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[keyResult.value] = result.value;
        }
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  if (def.values.length === 0) {
    throw new Error("Cannot create literal schema with no valid values");
  }
  const values = new Set(def.values);
  inst._zod.values = values;
  inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    payload.fallback = true;
    return payload;
  };
});
function handleOptionalResult(result, input) {
  if (input === undefined && (result.issues.length || result.fallback)) {
    return { issues: [], value: undefined };
  }
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      const input = payload.value;
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, input));
      return handleOptionalResult(result, input);
    }
    if (payload.value === undefined) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => {
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
      payload.fallback = true;
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
  defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// node_modules/zod/v4/core/registries.js
var _a2;
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn, params) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? undefined
  };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema = seen.schema;
    for (const key in schema) {
      delete schema[key];
    }
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema = seen.def ?? seen.schema;
    const _cached = { ...schema };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema.allOf = schema.allOf ?? [];
        schema.allOf.push(refSchema);
      } else {
        Object.assign(schema, refSchema);
      }
      Object.assign(schema, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {}
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== undefined && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) {} else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  process(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time") {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1) {
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, _params) => {
  const def = schema._zod.def;
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Literal `undefined` cannot be represented in JSON Schema");
      }
    } else if (typeof val === "bigint") {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt literals cannot be represented in JSON Schema");
      } else {
        vals.push(Number(val));
      }
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {} else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Custom types cannot be represented in JSON Schema");
  }
};
var transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw") {
    throw new Error("Transforms cannot be represented in JSON Schema");
  }
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = process(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  json.properties = {};
  const shape = def.shape;
  for (const key in shape) {
    json.properties[key] = process(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  }
  const allKeys = new Set(Object.keys(shape));
  const requiredKeys = new Set([...allKeys].filter((key) => {
    const v = def.shape[key]._zod;
    if (ctx.io === "input") {
      return v.optin === undefined;
    } else {
      return v.optout === undefined;
    }
  }));
  if (requiredKeys.size > 0) {
    json.required = Array.from(requiredKeys);
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = process(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => process(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = process(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = process(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const keyBag = keyType._zod.bag;
  const patterns = keyBag?.patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      json.patternProperties[pattern.source] = valueSchema;
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = process(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
    }
    json.additionalProperties = process(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  if (keyValues) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues;
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  process(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  process(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
// node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue) => {
        inst.issues.push(issue);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues) => {
        inst.issues.push(...issues);
        inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse3 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap;
function _installLazyMethods(inst, group, methods) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = new Set;
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods) {
    const fn = methods[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v
        });
      }
    });
  }
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  Object.assign(inst["~standard"], {
    jsonSchema: {
      input: createStandardJSONSchemaMethod(inst, "input"),
      output: createStandardJSONSchemaMethod(inst, "output")
    }
  });
  inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
  inst.def = def;
  inst.type = def.type;
  Object.defineProperty(inst, "_def", { value: def });
  inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.encode = (data, params) => encode(inst, data, params);
  inst.decode = (data, params) => decode(inst, data, params);
  inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
  inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
  inst.safeEncode = (data, params) => safeEncode(inst, data, params);
  inst.safeDecode = (data, params) => safeDecode(inst, data, params);
  inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
  inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
  _installLazyMethods(inst, "ZodType", {
    check(...chks) {
      const def = this.def;
      return this.clone(mergeDefs(def, {
        checks: [
          ...def.checks ?? [],
          ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
        ]
      }), { parent: true });
    },
    with(...chks) {
      return this.check(...chks);
    },
    clone(def, params) {
      return clone(this, def, params);
    },
    brand() {
      return this;
    },
    register(reg, meta) {
      reg.add(this, meta);
      return this;
    },
    refine(check, params) {
      return this.check(refine(check, params));
    },
    superRefine(refinement, params) {
      return this.check(superRefine(refinement, params));
    },
    overwrite(fn) {
      return this.check(_overwrite(fn));
    },
    optional() {
      return optional(this);
    },
    exactOptional() {
      return exactOptional(this);
    },
    nullable() {
      return nullable(this);
    },
    nullish() {
      return optional(nullable(this));
    },
    nonoptional(params) {
      return nonoptional(this, params);
    },
    array() {
      return array(this);
    },
    or(arg) {
      return union([this, arg]);
    },
    and(arg) {
      return intersection(this, arg);
    },
    transform(tx) {
      return pipe(this, transform(tx));
    },
    default(d) {
      return _default(this, d);
    },
    prefault(d) {
      return prefault(this, d);
    },
    catch(params) {
      return _catch(this, params);
    },
    pipe(target) {
      return pipe(this, target);
    },
    readonly() {
      return readonly(this);
    },
    describe(description) {
      const cl = this.clone();
      globalRegistry.add(cl, { description });
      return cl;
    },
    meta(...args) {
      if (args.length === 0)
        return globalRegistry.get(this);
      const cl = this.clone();
      globalRegistry.add(cl, args[0]);
      return cl;
    },
    isOptional() {
      return this.safeParse(undefined).success;
    },
    isNullable() {
      return this.safeParse(null).success;
    },
    apply(fn) {
      return fn(this);
    }
  });
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  _installLazyMethods(inst, "_ZodString", {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  });
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
  _installLazyMethods(inst, "ZodNumber", {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  });
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
  _installLazyMethods(inst, "ZodArray", {
    min(n, params) {
      return this.check(_minLength(n, params));
    },
    nonempty(params) {
      return this.check(_minLength(1, params));
    },
    max(n, params) {
      return this.check(_maxLength(n, params));
    },
    length(n, params) {
      return this.check(_length(n, params));
    },
    unwrap() {
      return this.element;
    }
  });
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  defineLazy(inst, "shape", () => {
    return def.shape;
  });
  _installLazyMethods(inst, "ZodObject", {
    keyof() {
      return _enum(Object.keys(this._zod.def.shape));
    },
    catchall(catchall) {
      return this.clone({ ...this._zod.def, catchall });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: unknown() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: never() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: undefined });
    },
    extend(incoming) {
      return extend(this, incoming);
    },
    safeExtend(incoming) {
      return safeExtend(this, incoming);
    },
    merge(other) {
      return merge(this, other);
    },
    pick(mask) {
      return pick(this, mask);
    },
    omit(mask) {
      return omit(this, mask);
    },
    partial(...args) {
      return partial(ZodOptional, this, args[0]);
    },
    required(...args) {
      return required(ZodNonOptional, this, args[0]);
    }
  });
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        payload.fallback = true;
        return payload;
      });
    }
    payload.value = output;
    payload.fallback = true;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}

// node_modules/zod/v4/classic/compat.js
var ZodIssueCode = {
  invalid_type: "invalid_type",
  too_big: "too_big",
  too_small: "too_small",
  invalid_format: "invalid_format",
  not_multiple_of: "not_multiple_of",
  unrecognized_keys: "unrecognized_keys",
  invalid_union: "invalid_union",
  invalid_key: "invalid_key",
  invalid_element: "invalid_element",
  invalid_value: "invalid_value",
  custom: "custom"
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
// packages/core/src/updates/semver.ts
function parseSemver(v) {
  const core = (v ?? "").trim().replace(/^v/i, "").split(/[-+]/)[0] ?? "";
  const parts = core.split(".").map((n) => parseInt(n, 10) || 0);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}
function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  for (let i = 0;i < 3; i++) {
    if (pa[i] > pb[i])
      return 1;
    if (pa[i] < pb[i])
      return -1;
  }
  return 0;
}

// packages/core/src/apps/schema.ts
var MAX_SUPPORTED_SCHEMA = 1;
var serviceBuild = object({
  dockerfile: string2().optional(),
  context: string2().optional(),
  dockerfilePath: string2().optional(),
  files: array(object({ path: string2(), content: string2() })).optional(),
  args: record(string2(), string2()).optional()
});
var serviceSpec = object({
  name: string2(),
  image: string2().optional(),
  build: serviceBuild.optional(),
  ports: array(string2()).optional(),
  exposedPort: number2().optional(),
  routes: array(object({ port: number2(), slugSuffix: string2().optional() })).optional(),
  environment: record(string2(), string2()).optional(),
  secretEnv: array(string2()).optional(),
  volumes: array(string2()).optional(),
  dependsOn: array(string2()).optional(),
  exposed: boolean2().optional(),
  healthcheck: unknown().optional(),
  restart: _enum(["no", "always", "on-failure", "unless-stopped"]).optional(),
  command: string2().optional(),
  commandArgv: array(string2()).optional(),
  stopGracePeriod: string2().optional()
});
var configField = object({
  key: string2(),
  service: string2(),
  label: string2(),
  help: string2().optional(),
  type: _enum(["text", "password"]).optional(),
  default: string2().optional(),
  generate: _enum(["secret", "jwt", "randomPort"]).optional(),
  generateGroup: string2().optional(),
  jwtSecretGroup: string2().optional(),
  jwtRole: string2().optional(),
  required: boolean2().optional(),
  secret: boolean2().optional()
});
var localized = union([string2(), record(string2(), string2())]);
var prepareStep = object({
  service: string2(),
  command: string2(),
  capture: string2(),
  capturePattern: string2().optional(),
  persistAs: object({ key: string2(), secret: boolean2().optional() }).optional(),
  once: boolean2().optional(),
  phase: _enum(["pre-deploy", "post-start", "post-ready"]).optional(),
  mustSucceed: boolean2().optional(),
  readiness: object({
    test: string2(),
    interval: number2().optional(),
    retries: number2().optional()
  }).optional(),
  title: localized.optional(),
  description: localized.optional(),
  icon: string2().optional()
});
var outputVariant = object({
  id: string2(),
  label: union([string2(), record(string2(), string2())]),
  source: string2()
});
var connection = object({
  title: string2().optional(),
  description: string2().optional(),
  outputs: array(object({
    id: string2(),
    label: string2(),
    help: string2().optional(),
    source: string2(),
    secret: boolean2().optional(),
    envKey: string2().optional(),
    service: string2().optional(),
    recommended: boolean2().optional(),
    sourceLabel: union([string2(), record(string2(), string2())]).optional(),
    variants: array(outputVariant).optional(),
    width: _enum(["full", "half"]).optional(),
    kind: _enum(["text", "url"]).optional()
  })),
  guide: object({
    intro: union([string2(), record(string2(), string2())]).optional(),
    useHint: union([string2(), record(string2(), string2())]).optional(),
    defaultMode: _enum(["internal", "public"]).optional()
  }).optional(),
  firstLogin: object({
    username: localized.optional(),
    password: localized.optional(),
    note: localized.optional()
  }).optional()
});
var endpointMode = _enum(["domain", "port", "publish", "internal"]);
var endpoint = object({
  service: string2(),
  port: number2(),
  label: string2(),
  kind: _enum(["http", "tcp"]),
  required: boolean2().optional(),
  scope: _enum(["public", "internal", "local"]).optional(),
  defaultMode: endpointMode.optional(),
  allowedModes: array(endpointMode).optional()
});
var provides = object({
  id: string2(),
  outputRefs: array(string2()),
  category: string2().optional()
});
var requires = object({
  id: string2(),
  label: localized,
  category: string2().optional(),
  envKey: string2(),
  mode: _enum(["internal", "public"]).optional(),
  optional: boolean2().optional()
});
var file = object({
  service: string2(),
  path: string2(),
  content: string2()
});
var settingOption = object({ value: string2(), label: string2() });
var settingField = object({
  key: string2(),
  service: string2(),
  label: string2(),
  help: string2().optional(),
  type: _enum([
    "text",
    "password",
    "boolean",
    "select",
    "number",
    "multiselect",
    "radio",
    "textarea"
  ]),
  options: array(settingOption).optional(),
  separator: string2().optional(),
  min: number2().optional(),
  max: number2().optional(),
  step: number2().optional(),
  integer: boolean2().optional(),
  pattern: string2().optional(),
  patternError: string2().optional(),
  default: string2().optional(),
  placeholder: string2().optional(),
  secret: boolean2().optional(),
  trueValue: string2().optional(),
  falseValue: string2().optional(),
  requiresRedeploy: boolean2().optional(),
  advanced: boolean2().optional(),
  installStep: boolean2().optional(),
  required: boolean2().optional(),
  showIf: object({
    field: string2(),
    service: string2().optional(),
    equals: union([string2(), array(string2())]).optional(),
    truthy: boolean2().optional()
  }).optional()
});
var settingGroup = object({
  id: string2(),
  label: string2(),
  description: string2().optional(),
  fields: array(settingField)
});
var management = union([
  object({ kind: literal("schema") }),
  object({ kind: literal("custom"), href: string2() })
]);
var appTemplateSchema = object({
  id: string2(),
  name: string2(),
  description: string2(),
  kind: _enum(["template", "flow"]),
  logo: string2(),
  category: _enum([
    "backend",
    "database",
    "cms",
    "mail",
    "analytics",
    "automation",
    "other"
  ]),
  tags: array(string2()).optional(),
  framework: string2().optional(),
  services: array(serviceSpec).optional(),
  configFields: array(configField).optional(),
  flowHref: string2().optional(),
  settings: array(settingGroup).optional(),
  management: management.optional(),
  prepare: array(prepareStep).optional(),
  connection: connection.optional(),
  endpoints: array(endpoint).optional(),
  files: array(file).optional(),
  provides: array(provides).optional(),
  requires: array(requires).optional(),
  available: boolean2().optional(),
  minResources: object({
    memoryMb: number2().positive().optional(),
    cpuCores: number2().positive().optional()
  }).optional(),
  verified: boolean2().optional(),
  unlisted: boolean2().optional(),
  hosting: _enum(["self-hosted", "experimental"]).optional(),
  schemaVersion: number2().optional(),
  minEngine: string2().optional(),
  updatedAt: string2().optional(),
  repository: string2().url().optional()
}).superRefine((data, ctx) => {
  const svcNames = new Set((data.services ?? []).map((s) => s.name));
  const refSvc = (service, path, where) => {
    if (svcNames.size > 0 && !svcNames.has(service)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path,
        message: `${where} references unknown service "${service}"`
      });
    }
  };
  (data.configFields ?? []).forEach((f, i) => refSvc(f.service, ["configFields", i, "service"], "configField"));
  (data.prepare ?? []).forEach((p, i) => refSvc(p.service, ["prepare", i, "service"], "prepare"));
  (data.endpoints ?? []).forEach((e, i) => refSvc(e.service, ["endpoints", i, "service"], "endpoint"));
  (data.files ?? []).forEach((f, i) => refSvc(f.service, ["files", i, "service"], "file"));
  (data.settings ?? []).forEach((g, gi) => g.fields.forEach((f, fi) => refSvc(f.service, ["settings", gi, "fields", fi, "service"], "setting")));
  const SOURCE_RE = /^(env:[^:]+:[^:]+|publicUrl:[^:]+(:\d+)?|template:.*)$/;
  const checkSource = (source, path, where) => {
    if (!SOURCE_RE.test(source)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path,
        message: `invalid ${where} source "${source}"`
      });
    }
    const m = source.match(/^(?:env|publicUrl):([^:]+)/);
    if (m)
      refSvc(m[1], path, where);
  };
  (data.connection?.outputs ?? []).forEach((o, i) => {
    checkSource(o.source, ["connection", "outputs", i, "source"], "output");
    if (o.service)
      refSvc(o.service, ["connection", "outputs", i, "service"], "output");
    (o.variants ?? []).forEach((v, j) => {
      checkSource(v.source, ["connection", "outputs", i, "variants", j, "source"], "variant");
    });
  });
  const groups = new Set((data.configFields ?? []).map((f) => f.generateGroup).filter(Boolean));
  (data.configFields ?? []).forEach((f, i) => {
    if (f.jwtSecretGroup && !groups.has(f.jwtSecretGroup)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["configFields", i, "jwtSecretGroup"],
        message: `jwtSecretGroup "${f.jwtSecretGroup}" has no matching generateGroup`
      });
    }
  });
  if (data.flowHref !== undefined && !data.flowHref.startsWith("/")) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["flowHref"],
      message: "flowHref must be an internal route starting with /"
    });
  }
  const CONTEXT_RE = /^https:\/\/[^/\s@]+(\/[^\s]*?)?(\.git)?(#[A-Za-z0-9._/-]+)?$/;
  (data.services ?? []).forEach((s, i) => {
    const hasImage = typeof s.image === "string" && s.image.length > 0;
    const hasBuild = !!s.build;
    if (hasImage === hasBuild) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["services", i],
        message: `service "${s.name}" must set exactly one of image|build`
      });
    }
    if (!s.build)
      return;
    const b = s.build;
    const hasDockerfile = typeof b.dockerfile === "string" && b.dockerfile.length > 0;
    const hasContext = typeof b.context === "string" && b.context.length > 0;
    if (!hasDockerfile && !hasContext) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["services", i, "build"],
        message: `service "${s.name}" build needs a dockerfile, a context, or both`
      });
    }
    if (hasContext && !CONTEXT_RE.test(b.context)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["services", i, "build", "context"],
        message: `service "${s.name}" context must be a public https git URL ` + `with an optional #ref`
      });
    }
    if (b.dockerfilePath !== undefined && !hasContext) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["services", i, "build", "dockerfilePath"],
        message: `service "${s.name}" dockerfilePath needs a remote context`
      });
    }
    if (b.dockerfilePath !== undefined) {
      const p = b.dockerfilePath;
      if (!p.length || p.startsWith("/") || p.split("/").includes("..")) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["services", i, "build", "dockerfilePath"],
          message: `service "${s.name}" dockerfilePath must stay inside the repo`
        });
      }
    }
    if ((b.files?.length ?? 0) > 0 && hasContext) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["services", i, "build", "files"],
        message: `service "${s.name}" files[] is inline-only and cannot combine ` + `with a remote context`
      });
    }
  });
  const outputIds = new Set((data.connection?.outputs ?? []).map((o) => o.id));
  (data.provides ?? []).forEach((p, i) => {
    p.outputRefs.forEach((ref, j) => {
      if (!outputIds.has(ref)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["provides", i, "outputRefs", j],
          message: `provides references unknown output "${ref}"`
        });
      }
    });
  });
});
function parseAppTemplate(raw, opts) {
  const parsed = appTemplateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "shape",
      detail: parsed.error.issues[0]?.message
    };
  }
  const schemaVersion = parsed.data.schemaVersion ?? 1;
  if (schemaVersion > MAX_SUPPORTED_SCHEMA) {
    return {
      ok: false,
      reason: "schema-too-new",
      detail: `schemaVersion ${schemaVersion}`
    };
  }
  const minEngine = parsed.data.minEngine;
  if (minEngine && opts?.engineVersion && compareSemver(opts.engineVersion, minEngine) < 0) {
    return {
      ok: false,
      reason: "engine-too-new",
      detail: `minEngine ${minEngine}`
    };
  }
  return { ok: true };
}
// packages/core/src/apps/catalog.json
var catalog_default = {
  version: 1,
  apps: [
    {
      available: true,
      verified: true,
      id: "mail",
      name: "Kraft Mail",
      description: "Your own mail on your own domain — SMTP/IMAP, mailboxes and webmail on one server. Or keep the mailboxes you already have and just run the webmail.",
      kind: "flow",
      logo: "mail",
      category: "mail",
      tags: [
        "mail",
        "email",
        "smtp",
        "imap"
      ],
      flowHref: "/apps/new/mail",
      management: {
        kind: "custom",
        href: "/emails"
      }
    },
    {
      available: true,
      verified: true,
      id: "supabase",
      name: "Supabase",
      description: "Full self-hosted Supabase — Postgres, Auth, REST, Realtime, Storage, and Studio behind one API gateway.",
      kind: "template",
      logo: "supabase",
      category: "backend",
      tags: [
        "backend",
        "database",
        "postgres",
        "auth",
        "realtime",
        "storage"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "db",
          image: "supabase/postgres:17.6.1.136",
          environment: {
            POSTGRES_HOST: "/var/run/postgresql",
            PGPORT: "5432",
            POSTGRES_PORT: "5432",
            PGPASSWORD: "{{config:POSTGRES_PASSWORD}}",
            PGDATABASE: "postgres",
            POSTGRES_DB: "postgres",
            JWT_EXP: "3600"
          },
          volumes: [
            "supabase_db_data:/var/lib/postgresql/data",
            "supabase_db_config:/etc/postgresql-custom"
          ],
          healthcheck: {
            test: [
              "CMD",
              "pg_isready",
              "-U",
              "postgres",
              "-h",
              "localhost"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 10
          },
          restart: "unless-stopped"
        },
        {
          name: "kong",
          image: "kong:3.9.1",
          exposedPort: 8000,
          exposed: true,
          routes: [
            {
              port: 8000
            }
          ],
          dependsOn: [
            "auth",
            "rest",
            "realtime-dev.supabase-realtime",
            "storage",
            "meta",
            "studio"
          ],
          environment: {
            KONG_DATABASE: "off",
            KONG_DECLARATIVE_CONFIG: "/usr/local/kong/kong.yml",
            KONG_ROUTER_FLAVOR: "traditional_compatible",
            KONG_DNS_ORDER: "LAST,A,CNAME",
            KONG_PLUGINS: "request-transformer,cors,key-auth,acl,basic-auth,request-termination",
            KONG_NGINX_PROXY_PROXY_BUFFER_SIZE: "160k",
            KONG_NGINX_PROXY_PROXY_BUFFERS: "64 160k"
          },
          healthcheck: {
            test: [
              "CMD",
              "kong",
              "health"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5
          },
          restart: "unless-stopped"
        },
        {
          name: "auth",
          image: "supabase/gotrue:v2.189.0",
          dependsOn: [
            "db"
          ],
          environment: {
            GOTRUE_API_HOST: "0.0.0.0",
            GOTRUE_API_PORT: "9999",
            API_EXTERNAL_URL: "{{publicUrl:kong}}",
            GOTRUE_SAML_EXTERNAL_URL: "{{publicUrl:kong}}/auth/v1",
            GOTRUE_DB_DRIVER: "postgres",
            GOTRUE_DB_DATABASE_URL: "postgres://supabase_auth_admin:{{config:POSTGRES_PASSWORD}}@db:5432/postgres",
            GOTRUE_SITE_URL: "{{publicUrl:kong}}",
            GOTRUE_URI_ALLOW_LIST: "",
            GOTRUE_DISABLE_SIGNUP: "false",
            GOTRUE_JWT_ADMIN_ROLES: "service_role",
            GOTRUE_JWT_AUD: "authenticated",
            GOTRUE_JWT_DEFAULT_GROUP_NAME: "authenticated",
            GOTRUE_JWT_EXP: "3600",
            GOTRUE_JWT_SECRET: "{{config:JWT_SECRET}}",
            GOTRUE_EXTERNAL_EMAIL_ENABLED: "true",
            GOTRUE_MAILER_AUTOCONFIRM: "true",
            GOTRUE_EXTERNAL_PHONE_ENABLED: "false",
            GOTRUE_SMS_AUTOCONFIRM: "true"
          },
          healthcheck: {
            test: [
              "CMD",
              "wget",
              "--no-verbose",
              "--tries=1",
              "--spider",
              "http://localhost:9999/health"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 3
          },
          restart: "unless-stopped"
        },
        {
          name: "rest",
          image: "postgrest/postgrest:v14.12",
          dependsOn: [
            "db"
          ],
          environment: {
            PGRST_DB_URI: "postgres://authenticator:{{config:POSTGRES_PASSWORD}}@db:5432/postgres",
            PGRST_DB_SCHEMAS: "public,storage,graphql_public",
            PGRST_DB_ANON_ROLE: "anon",
            PGRST_JWT_SECRET: "{{config:JWT_SECRET}}",
            PGRST_DB_USE_LEGACY_GUCS: "false",
            PGRST_APP_SETTINGS_JWT_SECRET: "{{config:JWT_SECRET}}",
            PGRST_APP_SETTINGS_JWT_EXP: "3600"
          },
          restart: "unless-stopped"
        },
        {
          name: "realtime-dev.supabase-realtime",
          image: "supabase/realtime:v2.102.3",
          dependsOn: [
            "db"
          ],
          environment: {
            PORT: "4000",
            DB_HOST: "db",
            DB_PORT: "5432",
            DB_USER: "supabase_admin",
            DB_PASSWORD: "{{config:POSTGRES_PASSWORD}}",
            DB_NAME: "postgres",
            DB_AFTER_CONNECT_QUERY: "SET search_path TO _realtime",
            DB_ENC_KEY: "supabaserealtime",
            API_JWT_SECRET: "{{config:JWT_SECRET}}",
            SECRET_KEY_BASE: "{{config:SECRET_KEY_BASE}}",
            METRICS_JWT_SECRET: "{{config:JWT_SECRET}}",
            ERL_AFLAGS: "-proto_dist inet_tcp",
            DNS_NODES: "''",
            RLIMIT_NOFILE: "10000",
            APP_NAME: "realtime",
            SEED_SELF_HOST: "true",
            RUN_JANITOR: "true"
          },
          restart: "unless-stopped"
        },
        {
          name: "storage",
          image: "supabase/storage-api:v1.60.4",
          dependsOn: [
            "db",
            "rest",
            "imgproxy"
          ],
          environment: {
            ANON_KEY: "{{config:ANON_KEY}}",
            SERVICE_KEY: "{{config:SERVICE_ROLE_KEY}}",
            POSTGREST_URL: "http://rest:3000",
            AUTH_JWT_SECRET: "{{config:JWT_SECRET}}",
            DATABASE_URL: "postgres://supabase_storage_admin:{{config:POSTGRES_PASSWORD}}@db:5432/postgres",
            FILE_SIZE_LIMIT: "52428800",
            STORAGE_BACKEND: "file",
            FILE_STORAGE_BACKEND_PATH: "/var/lib/storage",
            TENANT_ID: "stub",
            REGION: "stub",
            GLOBAL_S3_BUCKET: "stub",
            ENABLE_IMAGE_TRANSFORMATION: "true",
            IMGPROXY_URL: "http://imgproxy:5001"
          },
          volumes: [
            "supabase_storage_data:/var/lib/storage"
          ],
          healthcheck: {
            test: [
              "CMD",
              "wget",
              "--no-verbose",
              "--tries=1",
              "--spider",
              "http://127.0.0.1:5000/status"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 3
          },
          restart: "unless-stopped"
        },
        {
          name: "imgproxy",
          image: "darthsim/imgproxy:v3.30.1",
          environment: {
            IMGPROXY_BIND: ":5001",
            IMGPROXY_LOCAL_FILESYSTEM_ROOT: "/",
            IMGPROXY_USE_ETAG: "true",
            IMGPROXY_ENABLE_WEBP_DETECTION: "true"
          },
          volumes: [
            "supabase_storage_data:/var/lib/storage"
          ],
          healthcheck: {
            test: [
              "CMD",
              "imgproxy",
              "health"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 3
          },
          restart: "unless-stopped"
        },
        {
          name: "meta",
          image: "supabase/postgres-meta:v0.96.6",
          dependsOn: [
            "db"
          ],
          environment: {
            PG_META_PORT: "8080",
            PG_META_DB_HOST: "db",
            PG_META_DB_PORT: "5432",
            PG_META_DB_NAME: "postgres",
            PG_META_DB_USER: "postgres",
            PG_META_DB_PASSWORD: "{{config:POSTGRES_PASSWORD}}",
            CRYPTO_KEY: "{{config:PG_META_CRYPTO_KEY}}"
          },
          restart: "unless-stopped"
        },
        {
          name: "studio",
          image: "supabase/studio:2026.07.07-sha-a6a04f2",
          dependsOn: [
            "meta"
          ],
          environment: {
            HOSTNAME: "0.0.0.0",
            STUDIO_PG_META_URL: "http://meta:8080",
            POSTGRES_PASSWORD: "{{config:POSTGRES_PASSWORD}}",
            POSTGRES_USER_READ_WRITE: "postgres",
            DEFAULT_ORGANIZATION_NAME: "Default Organization",
            DEFAULT_PROJECT_NAME: "Default Project",
            SUPABASE_URL: "http://kong:8000",
            SUPABASE_PUBLIC_URL: "{{publicUrl:kong}}",
            SUPABASE_ANON_KEY: "{{config:ANON_KEY}}",
            SUPABASE_SERVICE_KEY: "{{config:SERVICE_ROLE_KEY}}",
            AUTH_JWT_SECRET: "{{config:JWT_SECRET}}",
            PG_META_CRYPTO_KEY: "{{config:PG_META_CRYPTO_KEY}}",
            POSTGRES_HOST: "db",
            POSTGRES_PORT: "5432",
            POSTGRES_DB: "postgres",
            PGRST_DB_SCHEMAS: "public,storage,graphql_public"
          },
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "POSTGRES_PASSWORD",
          service: "db",
          label: "Database password",
          help: "Auto-generated. The password for the Postgres superuser and Supabase service roles.",
          generate: "secret",
          secret: true
        },
        {
          key: "JWT_SECRET",
          service: "db",
          label: "JWT secret",
          help: "Auto-generated. Signs the anon and service_role API keys and every user session.",
          generate: "secret",
          generateGroup: "jwt",
          secret: true
        },
        {
          key: "ANON_KEY",
          service: "kong",
          label: "Anon key",
          help: "Auto-generated. The public API key for client-side (anonymous) requests.",
          generate: "jwt",
          jwtSecretGroup: "jwt",
          jwtRole: "anon"
        },
        {
          key: "SERVICE_ROLE_KEY",
          service: "kong",
          label: "Service role key",
          help: "Auto-generated. The secret API key that bypasses row-level security — keep it private.",
          generate: "jwt",
          jwtSecretGroup: "jwt",
          jwtRole: "service_role",
          secret: true
        },
        {
          key: "SECRET_KEY_BASE",
          service: "realtime-dev.supabase-realtime",
          label: "Realtime secret key base",
          help: "Auto-generated. Signs the Realtime service's internal tokens.",
          generate: "secret",
          secret: true
        },
        {
          key: "PG_META_CRYPTO_KEY",
          service: "meta",
          label: "Metadata crypto key",
          help: "Auto-generated. Encrypts connection credentials stored by postgres-meta.",
          generate: "secret",
          secret: true
        },
        {
          key: "DASHBOARD_PASSWORD",
          service: "kong",
          label: "Studio password",
          help: "Auto-generated. The password to sign in to Supabase Studio.",
          generate: "secret",
          secret: true
        },
        {
          key: "DASHBOARD_USERNAME",
          service: "kong",
          label: "Studio username",
          help: "The username to sign in to Supabase Studio.",
          default: "supabase"
        }
      ],
      files: [
        {
          service: "kong",
          path: "/usr/local/kong/kong.yml",
          content: `_format_version: "3.0"
_transform: true

consumers:
  - username: DASHBOARD
  - username: anon
    keyauth_credentials:
      - key: {{config:ANON_KEY}}
  - username: service_role
    keyauth_credentials:
      - key: {{config:SERVICE_ROLE_KEY}}

acls:
  - consumer: anon
    group: anon
  - consumer: service_role
    group: admin

basicauth_credentials:
  - consumer: DASHBOARD
    username: {{config:DASHBOARD_USERNAME}}
    password: {{config:DASHBOARD_PASSWORD}}

services:
  - name: auth-v1-open
    url: http://auth:9999/verify
    routes:
      - name: auth-v1-open
        strip_path: true
        paths:
          - /auth/v1/verify
    plugins:
      - name: cors
  - name: auth-v1-open-callback
    url: http://auth:9999/callback
    routes:
      - name: auth-v1-open-callback
        strip_path: true
        paths:
          - /auth/v1/callback
    plugins:
      - name: cors
  - name: auth-v1-open-authorize
    url: http://auth:9999/authorize
    routes:
      - name: auth-v1-open-authorize
        strip_path: true
        paths:
          - /auth/v1/authorize
    plugins:
      - name: cors
  - name: auth-v1-open-sso-acs
    url: http://auth:9999/sso/saml/acs
    routes:
      - name: auth-v1-open-sso-acs
        strip_path: true
        paths:
          - /auth/v1/sso/saml/acs
    plugins:
      - name: cors
  - name: auth-v1-open-sso-metadata
    url: http://auth:9999/sso/saml/metadata
    routes:
      - name: auth-v1-open-sso-metadata
        strip_path: true
        paths:
          - /auth/v1/sso/saml/metadata
    plugins:
      - name: cors
  - name: auth-v1
    url: http://auth:9999/
    routes:
      - name: auth-v1-all
        strip_path: true
        paths:
          - /auth/v1/
    plugins:
      - name: cors
      - name: key-auth
        config:
          hide_credentials: false
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
            - anon
  - name: rest-v1
    url: http://rest:3000/
    routes:
      - name: rest-v1-all
        strip_path: true
        paths:
          - /rest/v1/
    plugins:
      - name: cors
      - name: key-auth
        config:
          hide_credentials: true
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
            - anon
  - name: graphql-v1
    url: http://rest:3000/rpc/graphql
    routes:
      - name: graphql-v1-all
        strip_path: true
        paths:
          - /graphql/v1
    plugins:
      - name: cors
      - name: key-auth
        config:
          hide_credentials: true
      - name: request-transformer
        config:
          add:
            headers:
              - Content-Profile:graphql_public
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
            - anon
  - name: realtime-v1-ws
    url: http://realtime-dev.supabase-realtime:4000/socket/
    routes:
      - name: realtime-v1-ws
        strip_path: true
        paths:
          - /realtime/v1/
    plugins:
      - name: cors
      - name: key-auth
        config:
          hide_credentials: false
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
            - anon
  - name: storage-v1
    url: http://storage:5000/
    routes:
      - name: storage-v1-all
        strip_path: true
        paths:
          - /storage/v1/
    plugins:
      - name: cors
  - name: meta
    url: http://meta:8080/
    routes:
      - name: meta-all
        strip_path: true
        paths:
          - /pg/
    plugins:
      - name: key-auth
        config:
          hide_credentials: false
      - name: acl
        config:
          hide_groups_header: true
          allow:
            - admin
  - name: dashboard
    url: http://studio:3000/
    routes:
      - name: dashboard-all
        strip_path: true
        paths:
          - /
    plugins:
      - name: cors
      - name: basic-auth
        config:
          hide_credentials: true
`
        },
        {
          service: "db",
          path: "/docker-entrypoint-initdb.d/init-scripts/98-webhooks.sql",
          content: `BEGIN;
  -- Create pg_net extension
  CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
  -- Create supabase_functions schema
  CREATE SCHEMA supabase_functions AUTHORIZATION supabase_admin;
  GRANT USAGE ON SCHEMA supabase_functions TO postgres, anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA supabase_functions GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA supabase_functions GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA supabase_functions GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
  -- supabase_functions.migrations definition
  CREATE TABLE supabase_functions.migrations (
    version text PRIMARY KEY,
    inserted_at timestamptz NOT NULL DEFAULT NOW()
  );
  -- Initial supabase_functions migration
  INSERT INTO supabase_functions.migrations (version) VALUES ('initial');
  -- supabase_functions.hooks definition
  CREATE TABLE supabase_functions.hooks (
    id bigserial PRIMARY KEY,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    request_id bigint
  );
  CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);
  CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);
  COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';
  CREATE FUNCTION supabase_functions.http_request()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $function$;
  -- Supabase super admin
  DO
  $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;
  END
  $$;
  GRANT ALL PRIVILEGES ON SCHEMA supabase_functions TO supabase_functions_admin;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA supabase_functions TO supabase_functions_admin;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA supabase_functions TO supabase_functions_admin;
  ALTER USER supabase_functions_admin SET search_path = "supabase_functions";
  ALTER table "supabase_functions".migrations OWNER TO supabase_functions_admin;
  ALTER table "supabase_functions".hooks OWNER TO supabase_functions_admin;
  ALTER function "supabase_functions".http_request() OWNER TO supabase_functions_admin;
  GRANT supabase_functions_admin TO postgres;
  -- Remove unused supabase_pg_net_admin role
  DO
  $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_pg_net_admin'
    )
    THEN
      REASSIGN OWNED BY supabase_pg_net_admin TO supabase_admin;
      DROP OWNED BY supabase_pg_net_admin;
      DROP ROLE supabase_pg_net_admin;
    END IF;
  END
  $$;
  -- pg_net grants when extension is already enabled
  DO
  $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_extension
      WHERE extname = 'pg_net'
    )
    THEN
      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END
  $$;
  -- Event trigger for pg_net
  CREATE OR REPLACE FUNCTION extensions.grant_pg_net_access()
  RETURNS event_trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM pg_event_trigger_ddl_commands() AS ev
      JOIN pg_extension AS ext
      ON ev.objid = ext.oid
      WHERE ext.extname = 'pg_net'
    )
    THEN
      GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END;
  $$;
  COMMENT ON FUNCTION extensions.grant_pg_net_access IS 'Grants access to pg_net';
  DO
  $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_event_trigger
      WHERE evtname = 'issue_pg_net_access'
    ) THEN
      CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end WHEN TAG IN ('CREATE EXTENSION')
      EXECUTE PROCEDURE extensions.grant_pg_net_access();
    END IF;
  END
  $$;
  INSERT INTO supabase_functions.migrations (version) VALUES ('20210809183423_update_grants');
  ALTER function supabase_functions.http_request() SECURITY DEFINER;
  ALTER function supabase_functions.http_request() SET search_path = supabase_functions;
  REVOKE ALL ON FUNCTION supabase_functions.http_request() FROM PUBLIC;
  GRANT EXECUTE ON FUNCTION supabase_functions.http_request() TO postgres, anon, authenticated, service_role;
COMMIT;
`
        },
        {
          service: "db",
          path: "/docker-entrypoint-initdb.d/init-scripts/99-jwt.sql",
          content: `\\set jwt_secret \`echo "$JWT_SECRET"\`
\\set jwt_exp \`echo "$JWT_EXP"\`

ALTER DATABASE postgres SET "app.settings.jwt_secret" TO :'jwt_secret';
ALTER DATABASE postgres SET "app.settings.jwt_exp" TO :'jwt_exp';
`
        },
        {
          service: "db",
          path: "/docker-entrypoint-initdb.d/init-scripts/99-roles.sql",
          content: `\\set pgpass \`echo "$POSTGRES_PASSWORD"\`

ALTER USER authenticator WITH PASSWORD :'pgpass';
ALTER USER pgbouncer WITH PASSWORD :'pgpass';
ALTER USER supabase_auth_admin WITH PASSWORD :'pgpass';
ALTER USER supabase_functions_admin WITH PASSWORD :'pgpass';
ALTER USER supabase_storage_admin WITH PASSWORD :'pgpass';
`
        },
        {
          service: "db",
          path: "/docker-entrypoint-initdb.d/migrations/99-realtime.sql",
          content: `\\set pguser \`echo "$POSTGRES_USER"\`

create schema if not exists _realtime;
alter schema _realtime owner to :pguser;
`
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Supabase",
        description: "Point the Supabase client SDKs or Studio at this deployment. The service role key bypasses row-level security — keep it secret.",
        guide: {
          intro: "Your project gets the Supabase database connection, ready to use.",
          useHint: "Read `process.env.DATABASE_URL` in your code — it's set the next time your project deploys. Nothing else to do.",
          defaultMode: "internal"
        },
        outputs: [
          {
            id: "url",
            label: "Project URL",
            source: "publicUrl:kong",
            envKey: "SUPABASE_URL"
          },
          {
            id: "studio",
            label: "Studio",
            source: "publicUrl:kong",
            kind: "url",
            help: "Open in a browser and sign in with the Studio username + password below."
          },
          {
            id: "studioUser",
            label: "Studio username",
            source: "env:kong:DASHBOARD_USERNAME"
          },
          {
            id: "studioPassword",
            label: "Studio password",
            source: "env:kong:DASHBOARD_PASSWORD",
            secret: true
          },
          {
            id: "anonKey",
            label: "Anon (public) key",
            source: "env:kong:ANON_KEY",
            envKey: "SUPABASE_ANON_KEY"
          },
          {
            id: "serviceKey",
            label: "Service role key",
            source: "env:kong:SERVICE_ROLE_KEY",
            secret: true,
            envKey: "SUPABASE_SERVICE_ROLE_KEY",
            help: "Full-access key — never expose it to browsers."
          },
          {
            id: "dbUrl",
            label: "Database URL",
            source: "template:postgresql://postgres:{{env:db:POSTGRES_PASSWORD}}@db:5432/postgres",
            service: "db",
            secret: true,
            envKey: "DATABASE_URL",
            recommended: true,
            help: "Direct Postgres connection (superuser) reachable over this project's shared network. Connect another project to Supabase to inject it automatically."
          },
          {
            id: "dbPassword",
            label: "Database password",
            source: "env:db:POSTGRES_PASSWORD",
            secret: true,
            envKey: "POSTGRES_PASSWORD"
          }
        ]
      },
      endpoints: [
        {
          service: "kong",
          port: 8000,
          label: "Studio & API",
          kind: "http"
        },
        {
          service: "db",
          port: 5432,
          label: "Database",
          kind: "tcp",
          scope: "internal"
        }
      ],
      settings: [
        {
          id: "auth",
          label: "Auth",
          fields: [
            {
              key: "GOTRUE_DISABLE_SIGNUP",
              service: "auth",
              label: "Disable new sign-ups",
              type: "boolean",
              default: "false"
            },
            {
              key: "GOTRUE_MAILER_AUTOCONFIRM",
              service: "auth",
              label: "Auto-confirm new emails (no SMTP)",
              type: "boolean",
              default: "true"
            }
          ]
        }
      ]
    },
    {
      available: true,
      verified: false,
      id: "mongodb",
      name: "MongoDB",
      description: "MongoDB document database with the Mongo Express web admin UI.",
      kind: "template",
      logo: "mongodb",
      category: "backend",
      tags: [
        "database",
        "mongodb",
        "nosql",
        "documents"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "mongo",
          image: "mongo:7.0",
          ports: [
            "27017:27017"
          ],
          environment: {
            MONGO_INITDB_ROOT_USERNAME: "root"
          },
          volumes: [
            "mongo_data:/data/db"
          ],
          healthcheck: {
            test: [
              "CMD",
              "mongosh",
              "--quiet",
              "--eval",
              "db.adminCommand('ping')"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "20s"
          },
          restart: "unless-stopped"
        },
        {
          name: "mongo-express",
          image: "mongo-express:1.0.2",
          exposedPort: 8081,
          exposed: true,
          routes: [
            {
              port: 8081
            }
          ],
          dependsOn: [
            "mongo"
          ],
          environment: {
            ME_CONFIG_MONGODB_URL: "mongodb://root:{{config:MONGO_INITDB_ROOT_PASSWORD}}@mongo:27017/",
            ME_CONFIG_MONGODB_ENABLE_ADMIN: "true",
            ME_CONFIG_BASICAUTH_USERNAME: "admin"
          },
          healthcheck: {
            test: [
              "CMD-SHELL",
              'wget -q -S --spider http://127.0.0.1:8081/ 2>&1 | grep -q "HTTP/"'
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "20s"
          },
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "MONGO_INITDB_ROOT_PASSWORD",
          service: "mongo",
          label: "Database password",
          help: "Auto-generated. The password for the MongoDB root user.",
          generate: "secret",
          secret: true
        },
        {
          key: "ME_CONFIG_BASICAUTH_PASSWORD",
          service: "mongo-express",
          label: "Mongo Express password",
          help: "Auto-generated. The password to sign in to the Mongo Express web admin.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to MongoDB",
        description: "Open the Mongo Express admin in a browser, or point a driver at the database URL.",
        guide: {
          intro: "Your project gets the MongoDB connection, ready to use.",
          useHint: "Read `process.env.MONGODB_URI` in your code — it's set the next time your project deploys. Nothing else to do.",
          defaultMode: "internal"
        },
        outputs: [
          {
            id: "admin",
            label: "Mongo Express",
            source: "publicUrl:mongo-express",
            kind: "url",
            envKey: "MONGO_EXPRESS_URL",
            help: "Sign in with the username + password below."
          },
          {
            id: "adminUser",
            label: "Admin username",
            source: "env:mongo-express:ME_CONFIG_BASICAUTH_USERNAME",
            envKey: "MONGO_ADMIN_USER",
            width: "half"
          },
          {
            id: "adminPassword",
            label: "Admin password",
            source: "env:mongo-express:ME_CONFIG_BASICAUTH_PASSWORD",
            secret: true,
            envKey: "MONGO_ADMIN_PASSWORD",
            width: "half"
          },
          {
            id: "dbUrl",
            label: "Database URL",
            source: "template:mongodb://root:{{env:mongo:MONGO_INITDB_ROOT_PASSWORD}}@mongo:27017/",
            sourceLabel: "Internal",
            variants: [
              {
                id: "host",
                label: "From this server",
                source: "template:mongodb://root:{{env:mongo:MONGO_INITDB_ROOT_PASSWORD}}@{{host}}:27017/"
              }
            ],
            secret: true,
            envKey: "MONGODB_URI",
            recommended: true,
            help: 'Direct MongoDB connection (root user) on the project’s private network — use it from another service, or bind this app into a project. Port 27017 publishes on 127.0.0.1 only, so the "From this server" form works from the box itself or through an SSH tunnel, not from the internet.'
          }
        ]
      },
      endpoints: [
        {
          service: "mongo-express",
          port: 8081,
          label: "Mongo Express",
          kind: "http"
        },
        {
          service: "mongo",
          port: 27017,
          label: "Database",
          kind: "tcp"
        }
      ]
    },
    {
      available: true,
      verified: true,
      id: "convex",
      name: "Convex",
      description: "Self-hosted Convex reactive backend + dashboard, with a persistent data volume.",
      repository: "https://github.com/get-convex/convex-backend",
      kind: "template",
      logo: "convex",
      category: "backend",
      tags: [
        "backend",
        "database",
        "realtime"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "backend",
          image: "ghcr.io/get-convex/convex-backend:19431ea0dd90bc55ae58dbbd06d9aa045f97336f",
          ports: [],
          exposedPort: 3210,
          exposed: true,
          routes: [
            {
              port: 3210
            },
            {
              port: 3211,
              slugSuffix: "http"
            }
          ],
          environment: {
            INSTANCE_NAME: "convex-self-hosted",
            DISABLE_BEACON: "true",
            CONVEX_CLOUD_ORIGIN: "{{publicUrl:backend:3210}}",
            CONVEX_SITE_ORIGIN: "{{publicUrl:backend:3211}}"
          },
          secretEnv: [
            "INSTANCE_SECRET"
          ],
          volumes: [
            "convex_data:/convex/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "curl -f http://localhost:3210/version || exit 1"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "20s"
          },
          restart: "unless-stopped"
        },
        {
          name: "dashboard",
          image: "ghcr.io/get-convex/convex-dashboard:19431ea0dd90bc55ae58dbbd06d9aa045f97336f",
          ports: [],
          exposedPort: 6791,
          exposed: true,
          dependsOn: [
            "backend"
          ],
          environment: {
            NEXT_PUBLIC_DEPLOYMENT_URL: "{{publicUrl:backend}}"
          },
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "INSTANCE_SECRET",
          service: "backend",
          label: "Instance secret",
          help: "Auto-generated. Signs the admin key and internal tokens.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      prepare: [
        {
          service: "backend",
          command: "./generate_admin_key.sh",
          capture: "adminKey",
          capturePattern: "([^\\r\\n]+)\\s*$",
          persistAs: {
            key: "CONVEX_ADMIN_KEY"
          },
          once: true,
          title: "Generate admin key",
          description: "Mint the dashboard and CLI admin key from the instance secret.",
          icon: "key"
        }
      ],
      connection: {
        title: "Connect to this deployment",
        description: "Sign in to the Convex dashboard, or point the Convex CLI here, with these values.",
        outputs: [
          {
            id: "dashboard",
            label: "Dashboard URL",
            source: "publicUrl:dashboard",
            kind: "url",
            help: "Open the Convex dashboard UI, then sign in with the deployment URL and admin key below."
          },
          {
            id: "url",
            label: "Deployment URL",
            source: "env:backend:CONVEX_CLOUD_ORIGIN",
            kind: "url"
          },
          {
            id: "adminKey",
            label: "Admin Key",
            source: "env:backend:CONVEX_ADMIN_KEY",
            secret: true,
            help: "Paste into the Convex dashboard login (required each time you open it)."
          }
        ]
      },
      settings: [
        {
          id: "general",
          label: "General",
          fields: [
            {
              key: "DISABLE_BEACON",
              service: "backend",
              label: "Disable telemetry beacon",
              type: "boolean",
              default: "true"
            }
          ]
        },
        {
          id: "advanced",
          label: "Advanced",
          description: "Changing these regenerates or invalidates the deployment's admin key — the dashboard and CLI must be re-authenticated afterwards.",
          fields: [
            {
              key: "INSTANCE_NAME",
              service: "backend",
              label: "Instance name",
              help: "Sets the deployment name. Changing it AFTER the first deploy invalidates the admin key and locks the dashboard/CLI out — safest to set it here, at install.",
              type: "text",
              default: "convex-self-hosted",
              advanced: true,
              requiresRedeploy: true,
              installStep: true
            },
            {
              key: "INSTANCE_SECRET",
              service: "backend",
              label: "Instance secret",
              help: "Signs the admin key and internal tokens. Rotating it invalidates existing admin keys.",
              type: "password",
              secret: true,
              advanced: true,
              requiresRedeploy: true
            }
          ]
        }
      ]
    },
    {
      available: true,
      verified: true,
      id: "n8n",
      name: "n8n",
      description: "Workflow automation — connect apps and APIs with a visual editor.",
      kind: "template",
      logo: "n8n",
      category: "automation",
      tags: [
        "automation",
        "workflows",
        "integrations"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "n8n",
          image: "n8nio/n8n:2.39.4",
          exposedPort: 5678,
          exposed: true,
          environment: {
            N8N_PORT: "5678",
            N8N_PROTOCOL: "https",
            GENERIC_TIMEZONE: "UTC",
            WEBHOOK_URL: "{{publicUrl:n8n}}"
          },
          secretEnv: [
            "N8N_ENCRYPTION_KEY"
          ],
          volumes: [
            "n8n_data:/home/node/.n8n"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "N8N_ENCRYPTION_KEY",
          service: "n8n",
          label: "Encryption key",
          help: "Auto-generated. Encrypts stored credentials.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      settings: [
        {
          id: "general",
          label: "General",
          fields: [
            {
              key: "GENERIC_TIMEZONE",
              service: "n8n",
              label: "Timezone",
              help: "Used by Schedule and Cron nodes.",
              type: "text",
              default: "UTC",
              placeholder: "UTC",
              installStep: true
            },
            {
              key: "N8N_DEFAULT_LOCALE",
              service: "n8n",
              label: "Locale",
              type: "text",
              default: "en",
              placeholder: "en"
            }
          ]
        },
        {
          id: "executions",
          label: "Executions",
          description: "Bound stored execution history so the data volume doesn't grow without limit.",
          fields: [
            {
              key: "EXECUTIONS_DATA_PRUNE",
              service: "n8n",
              label: "Prune old executions",
              type: "boolean",
              default: "true"
            },
            {
              key: "EXECUTIONS_DATA_MAX_AGE",
              service: "n8n",
              label: "Keep executions for (hours)",
              help: "336 hours = 14 days.",
              type: "number",
              default: "336",
              integer: true,
              min: 1,
              advanced: true
            }
          ]
        }
      ],
      connection: {
        title: "Set up n8n",
        description: "n8n has no preset login. Open the editor and the first screen creates your owner account.",
        guide: {
          defaultMode: "public",
          intro: "Your project gets a private n8n instance for building workflows.",
          useHint: "Webhook nodes are published under the webhook base URL below — use that origin when registering callbacks with third parties."
        },
        outputs: [
          {
            id: "url",
            label: "Editor",
            source: "publicUrl:n8n",
            kind: "url",
            recommended: true,
            help: "First visit asks you to create the owner account."
          },
          {
            id: "webhookUrl",
            label: "Webhook base URL",
            source: "env:n8n:WEBHOOK_URL",
            kind: "url",
            envKey: "N8N_WEBHOOK_URL",
            help: "Base origin n8n advertises for Webhook nodes."
          }
        ],
        firstLogin: {
          note: "Create the owner account as soon as it deploys — the setup screen is unauthenticated until you do. Never change the generated encryption key afterwards or every stored credential becomes unreadable. n8n issues https-only session cookies, so sign in over the domain rather than a plain-http address."
        }
      }
    },
    {
      available: true,
      id: "ghost",
      name: "Ghost",
      description: "Modern publishing platform for blogs, newsletters, and membership sites. Claim the owner account on your first visit.",
      kind: "template",
      logo: "ghost",
      category: "cms",
      tags: [
        "cms",
        "blog",
        "newsletter"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "ghost-db",
          image: "mysql:8.0",
          environment: {
            MYSQL_DATABASE: "ghost"
          },
          secretEnv: [
            "MYSQL_ROOT_PASSWORD"
          ],
          volumes: [
            "ghost_db:/var/lib/mysql"
          ],
          restart: "unless-stopped"
        },
        {
          name: "ghost",
          image: "ghost:5-alpine",
          exposedPort: 2368,
          exposed: true,
          dependsOn: [
            "ghost-db"
          ],
          environment: {
            NODE_ENV: "production",
            url: "{{publicUrl:ghost}}",
            database__client: "mysql",
            database__connection__host: "ghost-db",
            database__connection__user: "root",
            database__connection__database: "ghost"
          },
          secretEnv: [
            "database__connection__password"
          ],
          volumes: [
            "ghost_content:/var/lib/ghost/content"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "MYSQL_ROOT_PASSWORD",
          service: "ghost-db",
          label: "Database password",
          generate: "secret",
          generateGroup: "ghostdb",
          secret: true
        },
        {
          key: "database__connection__password",
          service: "ghost",
          label: "Ghost DB password",
          generate: "secret",
          generateGroup: "ghostdb",
          secret: true
        }
      ],
      connection: {
        title: "Set up Ghost",
        description: "Ghost has no preset login. Open Ghost Admin and the first screen creates the owner account.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "admin",
            label: "Ghost Admin",
            source: "template:{{env:ghost:url}}/ghost/",
            kind: "url",
            recommended: true,
            help: "Create the owner account here on first visit."
          },
          {
            id: "url",
            label: "Site",
            source: "publicUrl:ghost",
            kind: "url",
            help: "The public blog."
          }
        ],
        firstLogin: {
          note: "Claim the owner account at /ghost/ immediately — it is unauthenticated until you do, so the first visitor owns the blog. Ghost may restart a few times on first boot while MySQL initialises; that is expected."
        }
      },
      verified: true
    },
    {
      available: true,
      verified: true,
      id: "directus",
      name: "Directus",
      description: "Headless CMS with an instant REST + GraphQL API over your data. Sign in with the admin email and generated password below.",
      repository: "https://github.com/directus/directus",
      kind: "template",
      logo: "directus",
      category: "cms",
      tags: [
        "cms",
        "headless",
        "api"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "directus",
          image: "directus/directus:12.3.1",
          exposedPort: 8055,
          exposed: true,
          routes: [
            {
              port: 8055
            }
          ],
          environment: {
            DB_CLIENT: "sqlite3",
            DB_FILENAME: "/directus/database/data.db",
            PUBLIC_URL: "{{publicUrl:directus}}",
            ADMIN_EMAIL: "admin@example.com"
          },
          secretEnv: [
            "SECRET",
            "ADMIN_PASSWORD"
          ],
          volumes: [
            "directus_database:/directus/database",
            "directus_uploads:/directus/uploads"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget -q -O /dev/null http://127.0.0.1:8055/server/health || exit 1"
            ],
            interval: "15s",
            timeout: "5s",
            retries: 8,
            startPeriod: "30s"
          },
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "SECRET",
          service: "directus",
          label: "App secret",
          help: "Auto-generated. Signs access tokens.",
          generate: "secret",
          secret: true
        },
        {
          key: "ADMIN_PASSWORD",
          service: "directus",
          label: "Admin password",
          help: "Auto-generated. The password for the admin account created on first boot. Directus has no sign-up screen, so without this no account would exist at all.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Sign in to Directus",
        description: "The admin account below is created automatically on the first boot. Change the password after your first sign-in.",
        guide: {
          intro: "A headless CMS plus a REST and GraphQL API over whatever collections you create.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "admin",
            label: "Admin app",
            source: "template:{{env:directus:PUBLIC_URL}}/admin",
            kind: "url",
            recommended: true,
            help: "The Directus admin app. Sign in with the email and password below."
          },
          {
            id: "url",
            label: "API URL",
            source: "publicUrl:directus",
            kind: "url",
            envKey: "DIRECTUS_URL",
            help: "Base URL for the REST + GraphQL API."
          },
          {
            id: "email",
            label: "Admin email",
            source: "env:directus:ADMIN_EMAIL",
            width: "half"
          },
          {
            id: "password",
            label: "Admin password",
            source: "env:directus:ADMIN_PASSWORD",
            secret: true,
            width: "half"
          }
        ],
        firstLogin: {
          note: "The admin is created only on the FIRST boot against an empty database. If you reinstall over an existing directus_database volume no new admin is made — reset one with `npx directus users passwd` inside the container."
        }
      },
      endpoints: [
        {
          service: "directus",
          port: 8055,
          label: "Directus",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      available: true,
      id: "nocodb",
      name: "NocoDB",
      description: "Airtable-style spreadsheet UI over an SQL database. Sign in with the admin account below.",
      kind: "template",
      logo: "nocodb",
      category: "database",
      tags: [
        "database",
        "airtable",
        "no-code"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "nocodb",
          image: "nocodb/nocodb:2026.09.0",
          exposedPort: 8080,
          exposed: true,
          volumes: [
            "nocodb_data:/usr/app/data"
          ],
          restart: "unless-stopped",
          environment: {
            NC_ADMIN_EMAIL: "admin@example.com"
          },
          secretEnv: [
            "NC_ADMIN_PASSWORD"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "NC_ADMIN_PASSWORD",
          service: "nocodb",
          label: "Admin password",
          help: "Auto-generated. Password for the super-admin account created on first boot.",
          generate: "secret",
          secret: true
        }
      ],
      connection: {
        title: "Sign in to NocoDB",
        description: "The super-admin account below is created on first boot. Change the password after signing in.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "NocoDB",
            source: "publicUrl:nocodb",
            kind: "url",
            recommended: true,
            help: "Sign in with the email and password below."
          },
          {
            id: "email",
            label: "Admin email",
            source: "env:nocodb:NC_ADMIN_EMAIL",
            width: "half"
          },
          {
            id: "password",
            label: "Admin password",
            source: "env:nocodb:NC_ADMIN_PASSWORD",
            secret: true,
            width: "half"
          }
        ],
        firstLogin: {
          note: "Anyone who reaches this URL can still create their own account (they land in their own workspace and cannot see your bases). Turn sign-up off in Account Settings → Authentication right after your first sign-in — the NC_INVITE_ONLY_SIGNUP env var no longer works in this version."
        }
      },
      verified: true
    },
    {
      available: true,
      id: "metabase",
      name: "Metabase",
      description: "Open-source business intelligence — dashboards and questions over your data. Create your admin account in the browser on first visit.",
      kind: "template",
      logo: "metabase",
      category: "analytics",
      tags: [
        "analytics",
        "bi",
        "dashboards"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "metabase",
          image: "metabase/metabase:v0.63.17.1",
          exposedPort: 3000,
          exposed: true,
          environment: {
            MB_DB_FILE: "/metabase-data/metabase.db",
            MB_SITE_URL: "{{publicUrl:metabase}}"
          },
          volumes: [
            "metabase_data:/metabase-data"
          ],
          restart: "unless-stopped",
          secretEnv: [
            "MB_ENCRYPTION_SECRET_KEY"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "MB_ENCRYPTION_SECRET_KEY",
          service: "metabase",
          label: "Encryption key",
          help: "Auto-generated. Encrypts saved database credentials at rest. Never change it after setup.",
          generate: "secret",
          secret: true
        }
      ],
      connection: {
        title: "Set up Metabase",
        description: "Metabase has no preset login. Open the link and the setup wizard will walk you through creating the admin account.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Metabase",
            source: "publicUrl:metabase",
            kind: "url",
            recommended: true,
            help: "First visit runs the setup wizard — the account you create there is the admin."
          }
        ],
        firstLogin: {
          note: "Complete the setup wizard immediately: it is unauthenticated, so whoever opens this URL first becomes the admin. Metabase can take a minute to finish migrations on first boot."
        }
      },
      verified: true
    },
    {
      available: true,
      verified: true,
      id: "grafana",
      name: "Grafana",
      description: "Dashboards and visualization for your metrics and logs. First login is admin / admin.",
      kind: "template",
      logo: "grafana",
      category: "analytics",
      tags: [
        "analytics",
        "dashboards",
        "monitoring"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "grafana",
          image: "grafana/grafana:13.2.1",
          ports: [],
          exposedPort: 3000,
          exposed: true,
          environment: {
            GF_SERVER_ROOT_URL: "{{publicUrl:grafana}}"
          },
          volumes: [
            "grafana_data:/var/lib/grafana"
          ],
          restart: "unless-stopped"
        }
      ],
      connection: {
        title: "Sign in to Grafana",
        outputs: [
          {
            id: "url",
            label: "URL",
            source: "publicUrl:grafana",
            kind: "url"
          }
        ],
        firstLogin: {
          username: "admin",
          password: "admin",
          note: "Change the admin password right after your first login."
        }
      }
    },
    {
      available: true,
      id: "gitea",
      name: "Gitea",
      description: "Self-hosted Git with issues and pull requests. The admin account below is created for you.",
      kind: "template",
      logo: "gitea",
      category: "other",
      tags: [
        "git",
        "vcs",
        "developer"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "gitea",
          image: "gitea/gitea:1",
          exposedPort: 3000,
          exposed: true,
          environment: {
            GITEA__server__ROOT_URL: "{{publicUrl:gitea}}",
            GITEA__security__INSTALL_LOCK: "true",
            GITEA__security__SECRET_KEY: "{{config:GITEA_SECRET_KEY}}",
            GITEA__database__DB_TYPE: "sqlite3",
            GITEA__service__DISABLE_REGISTRATION: "true",
            GITEA_ADMIN_USERNAME: "admin",
            GITEA_ADMIN_EMAIL: "admin@example.com"
          },
          volumes: [
            "gitea_data:/data"
          ],
          restart: "unless-stopped",
          secretEnv: [
            "GITEA_ADMIN_PASSWORD"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "GITEA_SECRET_KEY",
          service: "gitea",
          label: "Secret key",
          help: "Auto-generated. Signs Gitea's tokens and locks the installer.",
          generate: "secret",
          secret: true
        },
        {
          key: "GITEA_ADMIN_PASSWORD",
          service: "gitea",
          label: "Admin password",
          help: "Auto-generated. Password for the seeded admin account.",
          generate: "secret",
          secret: true
        }
      ],
      prepare: [
        {
          service: "gitea",
          title: "Create the Gitea admin",
          description: "Seeds the administrator account so you can sign in immediately.",
          command: 'su-exec git gitea admin user create --admin --username "$GITEA_ADMIN_USERNAME" --password "$GITEA_ADMIN_PASSWORD" --email "$GITEA_ADMIN_EMAIL" --must-change-password=false 2>&1 || true; echo done',
          capture: "gitea_admin",
          phase: "post-ready",
          readiness: {
            test: "su-exec git gitea admin user list >/dev/null 2>&1",
            interval: 3000,
            retries: 40
          }
        }
      ],
      connection: {
        title: "Sign in to Gitea",
        description: "Your admin account is created during install. New self-registration is disabled — invite users from Site Administration.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Gitea",
            source: "publicUrl:gitea",
            kind: "url",
            recommended: true,
            help: "Sign in with the username and password below."
          },
          {
            id: "username",
            label: "Admin username",
            source: "env:gitea:GITEA_ADMIN_USERNAME",
            width: "half"
          },
          {
            id: "password",
            label: "Admin password",
            source: "env:gitea:GITEA_ADMIN_PASSWORD",
            secret: true,
            width: "half"
          }
        ],
        firstLogin: {
          note: "INSTALL_LOCK is on, so the public setup wizard is disabled and cannot be used to hijack the instance. The password above works as-is."
        }
      },
      verified: true
    },
    {
      available: true,
      verified: true,
      id: "code-server",
      name: "code-server",
      description: "Run VS Code in your browser, on your server. Sign in with the auto-generated password below.",
      repository: "https://github.com/coder/code-server",
      kind: "template",
      logo: "code-server",
      category: "other",
      tags: [
        "developer",
        "ide",
        "vscode"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "code-server",
          image: "codercom/code-server:4.132.0",
          exposedPort: 8080,
          exposed: true,
          routes: [
            {
              port: 8080
            }
          ],
          secretEnv: [
            "PASSWORD"
          ],
          volumes: [
            "code_server_home:/home/coder"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "curl -fsS -o /dev/null http://127.0.0.1:8080/healthz || exit 1"
            ],
            interval: "15s",
            timeout: "5s",
            retries: 6,
            startPeriod: "20s"
          },
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "PASSWORD",
          service: "code-server",
          label: "Login password",
          help: "Auto-generated. Required to sign in. Uses PASSWORD (plaintext) rather than HASHED_PASSWORD, which expects an argon2 digest.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Sign in to code-server",
        description: "VS Code in the browser. Sign in with the generated password below.",
        guide: {
          intro: "A full VS Code editor running on your server, reachable from any browser.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Editor",
            source: "publicUrl:code-server",
            kind: "url",
            recommended: true,
            help: "Opens the browser IDE. Sign in with the password below."
          },
          {
            id: "password",
            label: "Login password",
            source: "env:code-server:PASSWORD",
            secret: true
          }
        ],
        firstLogin: {
          note: "Your whole home directory is the persisted volume, so files, extensions and settings all survive a redeploy. The editor opens /home/coder by default."
        }
      },
      endpoints: [
        {
          service: "code-server",
          port: 8080,
          label: "Editor",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      available: true,
      id: "uptime-kuma",
      name: "Uptime Kuma",
      description: "Self-hosted uptime monitoring with status pages and alerts. Create your admin account on the first visit.",
      kind: "template",
      logo: "uptime-kuma",
      category: "other",
      tags: [
        "monitoring",
        "uptime",
        "status"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "uptime-kuma",
          image: "louislam/uptime-kuma:1",
          exposedPort: 3001,
          exposed: true,
          volumes: [
            "uptime_kuma_data:/app/data"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      connection: {
        title: "Set up Uptime Kuma",
        description: "Uptime Kuma ships with no default login — the first page you see creates the admin account.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Uptime Kuma",
            source: "publicUrl:uptime-kuma",
            kind: "url",
            recommended: true,
            help: "First visit prompts you to create the administrator account."
          }
        ],
        firstLogin: {
          note: "Do this immediately after deploy: until you create the admin, anyone who opens this URL can claim the instance. Monitors and history live in the uptime_kuma_data volume."
        }
      },
      verified: true
    },
    {
      available: true,
      id: "vaultwarden",
      name: "Vaultwarden",
      description: "Lightweight self-hosted password manager (Bitwarden-compatible). Open the admin panel with the token below to invite your first account.",
      kind: "template",
      logo: "vaultwarden",
      category: "other",
      tags: [
        "passwords",
        "security",
        "bitwarden"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "vaultwarden",
          image: "vaultwarden/server:1.37.2",
          exposedPort: 80,
          exposed: true,
          environment: {
            DOMAIN: "{{publicUrl:vaultwarden}}",
            SIGNUPS_ALLOWED: "false"
          },
          volumes: [
            "vaultwarden_data:/data"
          ],
          restart: "unless-stopped",
          secretEnv: [
            "ADMIN_TOKEN"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "ADMIN_TOKEN",
          service: "vaultwarden",
          label: "Admin panel token",
          help: "Auto-generated. Unlocks /admin, where you invite your own account.",
          generate: "secret",
          secret: true
        }
      ],
      connection: {
        title: "Set up Vaultwarden",
        description: "Public sign-up is disabled. Open the admin panel with the token below, invite your own email address, then register that address in any Bitwarden client.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "admin",
            label: "Admin panel",
            source: "template:{{env:vaultwarden:DOMAIN}}/admin",
            kind: "url",
            recommended: true,
            help: "Paste the admin token below to sign in, then use Invite User."
          },
          {
            id: "url",
            label: "Vault URL",
            source: "publicUrl:vaultwarden",
            kind: "url",
            help: "Point the Bitwarden app/extension at this as its self-hosted server URL."
          },
          {
            id: "adminToken",
            label: "Admin token",
            source: "env:vaultwarden:ADMIN_TOKEN",
            secret: true,
            help: "Full control of the server. Treat it like a root password."
          }
        ],
        firstLogin: {
          note: "Invitations work without SMTP: after inviting your address in /admin, register that same address from the vault URL to set your master password."
        }
      },
      verified: true
    },
    {
      available: true,
      id: "freshrss",
      name: "FreshRSS",
      description: "Self-hosted RSS and Atom feed reader. Your account is created during install.",
      kind: "template",
      logo: "freshrss",
      category: "other",
      tags: [
        "rss",
        "feeds",
        "reader"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "freshrss",
          image: "freshrss/freshrss:8400",
          exposedPort: 80,
          exposed: true,
          volumes: [
            "freshrss_data:/var/www/FreshRSS/data"
          ],
          restart: "unless-stopped",
          environment: {
            FRESHRSS_ADMIN_USERNAME: "admin"
          },
          secretEnv: [
            "FRESHRSS_ADMIN_PASSWORD"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "FRESHRSS_ADMIN_PASSWORD",
          service: "freshrss",
          label: "Admin password",
          help: "Auto-generated. Password for the account created during install.",
          generate: "secret",
          secret: true
        }
      ],
      prepare: [
        {
          service: "freshrss",
          title: "Install FreshRSS",
          description: "Runs the headless installer and creates your account.",
          command: 'cd /var/www/FreshRSS && { [ -f ./data/config.php ] || php ./cli/do-install.php --default-user="$FRESHRSS_ADMIN_USERNAME" --auth-type=form --db-type=sqlite --api-enabled; } && { php ./cli/list-users.php 2>/dev/null | grep -qx "$FRESHRSS_ADMIN_USERNAME" || php ./cli/create-user.php --user "$FRESHRSS_ADMIN_USERNAME" --password "$FRESHRSS_ADMIN_PASSWORD" --language en; } && ./cli/access-permissions.sh >/dev/null 2>&1; echo done',
          capture: "freshrss_install",
          phase: "post-ready",
          readiness: {
            test: "test -d /var/www/FreshRSS/cli",
            interval: 3000,
            retries: 30
          }
        }
      ],
      connection: {
        title: "Sign in to FreshRSS",
        description: "FreshRSS is installed headlessly during setup — sign in with the credentials below.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Reader",
            source: "publicUrl:freshrss",
            kind: "url",
            recommended: true,
            help: "Sign in with the username and password below."
          },
          {
            id: "username",
            label: "Username",
            source: "env:freshrss:FRESHRSS_ADMIN_USERNAME",
            width: "half"
          },
          {
            id: "password",
            label: "Password",
            source: "env:freshrss:FRESHRSS_ADMIN_PASSWORD",
            secret: true,
            width: "half"
          }
        ],
        firstLogin: {
          note: 'Deliberately NOT deployed with the public web installer, so nobody can claim your instance first. Feeds refresh on a schedule only if you set CRON_MIN (e.g. "*/20").'
        }
      },
      verified: true
    },
    {
      available: true,
      id: "stirling-pdf",
      name: "Stirling PDF",
      description: "Split, merge, convert, OCR and edit PDFs locally. Sign in with the admin account below.",
      kind: "template",
      logo: "stirling-pdf",
      category: "other",
      tags: [
        "pdf",
        "documents",
        "tools"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "stirling-pdf",
          image: "stirlingtools/stirling-pdf:2.14.3",
          exposedPort: 8080,
          exposed: true,
          volumes: [
            "stirling_config:/configs",
            "stirling_tessdata:/usr/share/tessdata"
          ],
          restart: "unless-stopped",
          environment: {
            SECURITY_ENABLELOGIN: "true",
            SECURITY_INITIALLOGIN_USERNAME: "admin"
          },
          secretEnv: [
            "SECURITY_INITIALLOGIN_PASSWORD"
          ],
          ports: []
        }
      ],
      configFields: [
        {
          key: "SECURITY_INITIALLOGIN_PASSWORD",
          service: "stirling-pdf",
          label: "Admin password",
          help: "Auto-generated. Replaces Stirling's public default password.",
          generate: "secret",
          secret: true
        }
      ],
      connection: {
        title: "Sign in to Stirling PDF",
        description: "Login is enabled and the admin account below is seeded on first boot, so the well-known default password is never used.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Stirling PDF",
            source: "publicUrl:stirling-pdf",
            kind: "url",
            recommended: true,
            help: "Sign in with the username and password below."
          },
          {
            id: "username",
            label: "Admin username",
            source: "env:stirling-pdf:SECURITY_INITIALLOGIN_USERNAME",
            width: "half"
          },
          {
            id: "password",
            label: "Admin password",
            source: "env:stirling-pdf:SECURITY_INITIALLOGIN_PASSWORD",
            secret: true,
            width: "half"
          }
        ],
        firstLogin: {
          note: "Seeding these two values is what prevents Stirling from creating its documented admin/stirling account. The password above works as-is."
        }
      },
      verified: true
    },
    {
      available: true,
      id: "it-tools",
      name: "IT-Tools",
      description: "A handy collection of developer and sysadmin utilities. No login, no setup.",
      kind: "template",
      logo: "it-tools",
      category: "other",
      tags: [
        "developer",
        "tools",
        "utilities"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "it-tools",
          image: "corentinth/it-tools:2024.10.22-7ca5933",
          exposedPort: 80,
          exposed: true,
          restart: "unless-stopped",
          ports: []
        }
      ],
      connection: {
        title: "Open IT-Tools",
        description: "A collection of developer and sysadmin utilities. No login, no setup, nothing stored.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "IT-Tools",
            source: "publicUrl:it-tools",
            kind: "url",
            recommended: true,
            help: "Opens the tool collection. No sign-in required."
          }
        ],
        firstLogin: {
          note: "Nothing to log into and nothing persisted — every tool runs in your browser. Anyone who can reach this URL can use it, so keep it internal if that matters."
        }
      },
      verified: true
    },
    {
      available: true,
      verified: true,
      id: "excalidraw",
      name: "Excalidraw",
      description: "Virtual whiteboard for sketches and diagrams. Stateless — drawings save in your browser.",
      kind: "template",
      logo: "excalidraw",
      category: "other",
      tags: [
        "whiteboard",
        "diagrams",
        "drawing"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "excalidraw",
          image: "excalidraw/excalidraw:sha-ff29780",
          exposedPort: 80,
          exposed: true,
          restart: "unless-stopped",
          ports: []
        }
      ],
      connection: {
        title: "Open Excalidraw",
        description: "No login and no server-side storage — open the link and start drawing.",
        guide: {
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Whiteboard",
            source: "publicUrl:excalidraw",
            kind: "url",
            recommended: true,
            help: "Opens the whiteboard. No sign-in required."
          }
        ],
        firstLogin: {
          note: "There is nothing to log into and nothing stored on the server: drawings live in your browser, so use Export to save anything you want to keep. Anyone who can reach this URL can use it — put it behind your own access control if that matters."
        }
      }
    },
    {
      available: false,
      id: "buzz",
      name: "Buzz",
      description: "Self-hostable workspace where humans and AI agents collaborate — chat, code, reviews, and workflows in one audit log.",
      kind: "template",
      logo: "buzz",
      category: "other",
      tags: [
        "collaboration",
        "ai",
        "agents",
        "chat",
        "workflows",
        "nostr"
      ]
    },
    {
      available: true,
      verified: true,
      minEngine: "0.6.6",
      id: "minio",
      name: "MinIO",
      description: "S3-compatible object storage with a web console — point any S3 client (aws-cli, SDKs) at it, or bind a bucket straight into another project's uploads.",
      kind: "template",
      logo: "minio",
      category: "database",
      tags: [
        "storage",
        "s3",
        "object-storage"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "minio",
          image: "minio/minio:RELEASE.2025-09-07T16-13-09Z-cpuv1",
          commandArgv: [
            "server",
            "/data",
            "--console-address",
            ":9001"
          ],
          exposedPort: 9001,
          routes: [
            {
              port: 9001
            },
            {
              port: 9000,
              slugSuffix: "s3"
            }
          ],
          exposed: true,
          environment: {
            MINIO_BROWSER_REDIRECT_URL: "{{publicUrl:minio}}"
          },
          secretEnv: [
            "MINIO_ROOT_PASSWORD"
          ],
          volumes: [
            "minio_data:/data"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "MINIO_ROOT_USER",
          service: "minio",
          label: "Root user (access key)",
          help: "The console + S3 admin username. Minimum 3 characters.",
          type: "text",
          default: "minio",
          required: true
        },
        {
          key: "MINIO_ROOT_PASSWORD",
          service: "minio",
          label: "Root password (secret key)",
          help: "Auto-generated. The S3 admin secret — shown once after install.",
          generate: "secret",
          secret: true
        },
        {
          key: "KRAFT_BUCKET",
          service: "minio",
          label: "First bucket",
          help: "Created on the first deploy so an app can use this storage immediately. More can be added from the console.",
          type: "text",
          default: "uploads",
          required: true
        }
      ],
      prepare: [
        {
          service: "minio",
          command: `mc alias set local http://127.0.0.1:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" > /dev/null && mc mb --ignore-existing "local/$KRAFT_BUCKET" > /dev/null && printf '%s' "$KRAFT_BUCKET"`,
          capture: "bucket",
          phase: "post-ready",
          readiness: {
            test: 'mc alias set local http://127.0.0.1:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"',
            interval: 1000,
            retries: 30
          }
        }
      ],
      endpoints: [
        {
          service: "minio",
          port: 9001,
          label: "Console",
          kind: "http"
        },
        {
          service: "minio",
          port: 9000,
          label: "S3 API",
          kind: "http"
        }
      ],
      connection: {
        title: "S3 connection",
        description: "Use these with any S3 client — the endpoint is the S3 API URL, the keys are the root user / password.",
        outputs: [
          {
            id: "console",
            label: "Console",
            source: "publicUrl:minio:9001",
            kind: "url"
          },
          {
            id: "endpoint",
            label: "S3 endpoint",
            source: "publicUrl:minio:9000",
            service: "minio",
            envKey: "S3_ENDPOINT",
            recommended: true
          },
          {
            id: "accessKey",
            label: "Access key",
            source: "env:minio:MINIO_ROOT_USER",
            service: "minio",
            envKey: "S3_ACCESS_KEY_ID",
            recommended: true
          },
          {
            id: "secretKey",
            label: "Secret key",
            source: "env:minio:MINIO_ROOT_PASSWORD",
            service: "minio",
            envKey: "S3_SECRET_ACCESS_KEY",
            secret: true,
            recommended: true
          },
          {
            id: "bucket",
            label: "Bucket",
            source: "env:minio:KRAFT_BUCKET",
            service: "minio",
            envKey: "S3_BUCKET"
          }
        ],
        guide: {
          intro: "Your app gets an S3-compatible bucket it can write uploads to.",
          useHint: "Bind it from the consuming project's Configuration → Object storage to get the framework's own env names (Laravel gets FILESYSTEM_DISK + AWS_*), or wire these values by hand.",
          defaultMode: "internal"
        }
      },
      provides: [
        {
          id: "s3",
          outputRefs: [
            "endpoint",
            "accessKey",
            "secretKey",
            "bucket"
          ],
          category: "database"
        }
      ]
    },
    {
      available: true,
      verified: false,
      id: "kafka",
      name: "Apache Kafka",
      description: "Apache Kafka event-streaming broker (KRaft mode — no ZooKeeper) with the Kafbat Kafka UI web console for topics, messages, and consumer groups.",
      kind: "template",
      logo: "apachekafka",
      category: "backend",
      tags: [
        "kafka",
        "streaming",
        "events",
        "queue",
        "messaging"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "kafka",
          image: "apache/kafka:4.0.0",
          environment: {
            KAFKA_NODE_ID: "1",
            KAFKA_PROCESS_ROLES: "broker,controller",
            KAFKA_LISTENERS: "PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093",
            KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092",
            KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER",
            KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT",
            KAFKA_INTER_BROKER_LISTENER_NAME: "PLAINTEXT",
            KAFKA_CONTROLLER_QUORUM_VOTERS: "1@kafka:9093",
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1",
            KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1",
            KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1",
            KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0",
            KAFKA_NUM_PARTITIONS: "3",
            KAFKA_LOG_DIRS: "/var/lib/kafka/data"
          },
          volumes: [
            "kafka_data:/var/lib/kafka/data"
          ],
          restart: "unless-stopped"
        },
        {
          name: "kafka-ui",
          image: "ghcr.io/kafbat/kafka-ui:v1.0.0",
          exposedPort: 8080,
          exposed: true,
          routes: [
            {
              port: 8080
            }
          ],
          dependsOn: [
            "kafka"
          ],
          environment: {
            KAFKA_CLUSTERS_0_NAME: "local",
            KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: "kafka:9092",
            DYNAMIC_CONFIG_ENABLED: "true",
            AUTH_TYPE: "LOGIN_FORM",
            SPRING_SECURITY_USER_NAME: "admin"
          },
          secretEnv: [
            "SPRING_SECURITY_USER_PASSWORD"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "SPRING_SECURITY_USER_PASSWORD",
          service: "kafka-ui",
          label: "Kafka UI password",
          help: "Auto-generated. The password to sign in to the Kafka UI web console (username: admin).",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Kafka",
        description: "Open the Kafka UI to browse topics and messages, or point a client at the broker from another service in this project.",
        outputs: [
          {
            id: "ui",
            label: "Kafka UI",
            source: "publicUrl:kafka-ui",
            kind: "url",
            help: "Sign in with the username + password below."
          },
          {
            id: "uiUser",
            label: "UI username",
            source: "env:kafka-ui:SPRING_SECURITY_USER_NAME"
          },
          {
            id: "uiPassword",
            label: "UI password",
            source: "env:kafka-ui:SPRING_SECURITY_USER_PASSWORD",
            secret: true
          },
          {
            id: "broker",
            label: "Bootstrap server (internal)",
            source: "template:kafka:9092",
            help: "Reachable as kafka:9092 from other services in this project — connect an app to it."
          }
        ]
      },
      endpoints: [
        {
          service: "kafka-ui",
          port: 8080,
          label: "Kafka UI",
          kind: "http"
        }
      ]
    },
    {
      available: true,
      verified: true,
      id: "qdrant",
      name: "Qdrant",
      description: "High-performance vector database for AI search, RAG, and embeddings — with the built-in Qdrant Web UI for browsing collections and running queries.",
      kind: "template",
      logo: "qdrant",
      category: "backend",
      tags: [
        "database",
        "vector",
        "ai",
        "search",
        "rag",
        "embeddings"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "qdrant",
          image: "qdrant/qdrant:v1.18.3",
          exposedPort: 6333,
          exposed: true,
          routes: [
            {
              port: 6333
            }
          ],
          secretEnv: [
            "QDRANT__SERVICE__API_KEY"
          ],
          volumes: [
            "qdrant_storage:/qdrant/storage"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "QDRANT__SERVICE__API_KEY",
          service: "qdrant",
          label: "API key",
          help: "Auto-generated. Required as the `api-key` header on every request, and to open the Web UI.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Qdrant",
        description: "Open the Qdrant Web UI in your browser (it lives under /dashboard), or point a client at the REST API. Every request needs the API key below.",
        outputs: [
          {
            id: "ui",
            label: "Qdrant Web UI",
            source: "publicUrl:qdrant",
            kind: "url",
            help: "The dashboard is at this URL under /dashboard. Paste the API key when it asks."
          },
          {
            id: "restUrl",
            label: "REST API",
            source: "publicUrl:qdrant"
          },
          {
            id: "apiKey",
            label: "API key",
            source: "env:qdrant:QDRANT__SERVICE__API_KEY",
            secret: true,
            help: "Send it as the `api-key` header on every request."
          }
        ]
      }
    },
    {
      available: true,
      verified: true,
      id: "meilisearch",
      name: "Meilisearch",
      description: "Lightning-fast, typo-tolerant search engine. Point any Meilisearch client at the URL below with the master key — index your documents and search in milliseconds.",
      kind: "template",
      logo: "meilisearch",
      category: "backend",
      tags: [
        "search",
        "full-text",
        "index",
        "typo-tolerant"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "meilisearch",
          image: "getmeili/meilisearch:v1.12",
          exposedPort: 7700,
          exposed: true,
          routes: [
            {
              port: 7700
            }
          ],
          environment: {
            MEILI_ENV: "production",
            MEILI_NO_ANALYTICS: "true"
          },
          secretEnv: [
            "MEILI_MASTER_KEY"
          ],
          volumes: [
            "meili_data:/meili_data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget -q -O - http://127.0.0.1:7700/health 2>&1 | grep -q available"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "10s"
          },
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "MEILI_MASTER_KEY",
          service: "meilisearch",
          label: "Master key",
          help: "Auto-generated. Send it as the `Authorization: Bearer` header on every request. Use it to mint scoped API keys.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Meilisearch",
        description: "Point a Meilisearch client at the URL with the master key. Every request needs the key as a Bearer token. There is no web dashboard in production mode — drive it from a Meilisearch client or curl.",
        guide: {
          intro: "Your project gets a Meilisearch endpoint plus its master key.",
          useHint: "Read `process.env.MEILISEARCH_URL` and `process.env.MEILISEARCH_KEY` in your code — set on your next deploy.",
          defaultMode: "internal"
        },
        outputs: [
          {
            id: "url",
            label: "API URL",
            source: "publicUrl:meilisearch",
            sourceLabel: "Public",
            variants: [
              {
                id: "internal",
                label: "Internal",
                source: "template:http://meilisearch:7700"
              }
            ],
            envKey: "MEILISEARCH_URL",
            recommended: true,
            help: "HTTP API endpoint — opening it in a browser returns a JSON status, not a UI (the bundled dashboard is off in production mode). Switch to Internal for apps on the same project network.",
            kind: "url"
          },
          {
            id: "masterKey",
            label: "Master key",
            source: "env:meilisearch:MEILI_MASTER_KEY",
            secret: true,
            envKey: "MEILISEARCH_KEY",
            recommended: true,
            help: "Send as the `Authorization: Bearer <key>` header. Full-access — mint scoped keys for clients."
          }
        ]
      },
      provides: [
        {
          id: "meilisearch",
          outputRefs: [
            "url",
            "masterKey"
          ],
          category: "search"
        }
      ],
      endpoints: [
        {
          service: "meilisearch",
          port: 7700,
          label: "Meilisearch",
          kind: "http"
        }
      ]
    },
    {
      available: true,
      verified: false,
      minEngine: "0.6.6",
      minResources: {
        memoryMb: 4096,
        cpuCores: 2
      },
      id: "neon",
      name: "Neon",
      description: "Self-hosted Neon — serverless Postgres with database branching, a web console and per-branch connection strings, in a single container. Built on the community `neond` control plane (Apache-2.0), which bundles Neon's pageserver, safekeeper, storage broker and storage controller behind a management API and dashboard. Neon's own cloud console is proprietary and the upstream neon repo ships no web UI, so a community control plane is the only way to run self-hosted Neon with a dashboard. One container with no HA, a ~1.2 GB image, and it publishes fixed host ports for branch endpoints — sized for development and preview databases rather than critical data.",
      repository: "https://github.com/matisiekpl/neond",
      kind: "template",
      logo: "neon",
      category: "database",
      tags: [
        "database",
        "postgres",
        "postgresql",
        "serverless",
        "sql",
        "branching"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "neond",
          image: "neond/neond:f04d396c133d81e28cf52560ea11ef7e9b814d71",
          exposed: true,
          exposedPort: 3000,
          routes: [
            {
              port: 3000
            }
          ],
          environment: {
            PORT: "3000",
            PORT_RANGE: "55432-55437",
            DO_NOT_TRACK: "1",
            TELEMETRY_DISABLED: "1",
            RUST_LOG: "info"
          },
          ports: [
            "0.0.0.0:55432:55432",
            "0.0.0.0:55433:55433",
            "0.0.0.0:55434:55434",
            "0.0.0.0:55435:55435",
            "0.0.0.0:55436:55436",
            "0.0.0.0:55437:55437"
          ],
          volumes: [
            "neond_data:/neond"
          ],
          healthcheck: {
            test: [
              "CMD",
              "curl",
              "-fsS",
              "http://127.0.0.1:3000/api/auth/setup"
            ],
            interval: "30s",
            timeout: "5s",
            retries: 3,
            startPeriod: "5m"
          },
          stopGracePeriod: "10m",
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "SERVER_SECRET",
          service: "neond",
          label: "Server secret",
          help: "Auto-generated, and PERMANENT — it is also the password of the internal management Postgres role, so changing it after the first launch makes the control plane unable to open its own database.",
          generate: "secret",
          secret: true
        },
        {
          key: "ADMIN_EMAIL",
          service: "neond",
          label: "Console admin email",
          help: "The first account is created for you and is the instance admin. Sign-up closes as soon as it exists.",
          type: "text",
          default: "admin@kraft.local",
          required: true
        },
        {
          key: "ADMIN_PASSWORD",
          service: "neond",
          label: "Console admin password",
          help: "Auto-generated. Use it with the admin email to sign in to the console.",
          generate: "secret",
          secret: true
        },
        {
          key: "PG_PASSWORD",
          service: "neond",
          label: "Database password",
          help: "Auto-generated. Set as the password of the `postgres` role on the first branch so the connection string below is usable immediately.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      prepare: [
        {
          service: "neond",
          title: "Create the console account and first branch",
          description: "Signs in (registering the admin on a first install), then ensures an organization, project and branch exist and an endpoint is running, and reports its port. Every run reports a REAL port, so a first attempt that raced the endpoint cannot leave the connection string permanently blank.",
          command: `set -e; API=http://127.0.0.1:3000/api; J='Content-Type: application/json'; id1() { sed -n 's/.*"id":"\\([^"]*\\)".*/\\1/p' | head -1; }; port1() { sed -n -e 's|.*"connection_string":"[^"]*@[^:"]*:\\([0-9][0-9]*\\)/.*|\\1|p' -e 's/.*"port":\\([0-9][0-9]*\\).*/\\1/p' | head -1; }; get() { curl -fsS -H "$A" "$1" 2>/dev/null || printf ''; }; post() { n=0; while [ $n -lt 20 ]; do r=$(curl -fsS -X POST "$1" -H "$J" -H "$A" -d "$2" 2>/dev/null || printf ''); [ -n "$r" ] && { printf %s "$r"; return 0; }; n=$((n+1)); sleep 2; done; printf ''; }; SETUP=$(curl -fsS "$API/auth/setup" || printf ''); case "$SETUP" in *'"registration_open":true'*) TOKEN=$(curl -fsS -X POST "$API/auth/register" -H "$J" -d "{\\"name\\":\\"Admin\\",\\"email\\":\\"$ADMIN_EMAIL\\",\\"password\\":\\"$ADMIN_PASSWORD\\"}" 2>/dev/null | sed -n 's/.*"token":"\\([^"]*\\)".*/\\1/p') ;; *) TOKEN=$(curl -fsS -X POST "$API/auth/login" -H "$J" -d "{\\"email\\":\\"$ADMIN_EMAIL\\",\\"password\\":\\"$ADMIN_PASSWORD\\"}" 2>/dev/null | sed -n 's/.*"token":"\\([^"]*\\)".*/\\1/p') ;; esac; [ -n "$TOKEN" ] || { echo "pg_port=no-token"; exit 0; }; A="Authorization: Bearer $TOKEN"; ORG=$(get "$API/organizations" | id1); [ -n "$ORG" ] || ORG=$(post "$API/organizations" '{"name":"Default"}' | id1); [ -n "$ORG" ] || { echo "pg_port=no-org"; exit 0; }; P="$API/organizations/$ORG/projects"; PROJ=$(get "$P" | id1); [ -n "$PROJ" ] || PROJ=$(post "$P" '{"name":"main"}' | id1); [ -n "$PROJ" ] || { echo "pg_port=no-project"; exit 0; }; B="$P/$PROJ/branches"; BRJSON=$(get "$B"); BR=$(printf %s "$BRJSON" | id1); if [ -z "$BR" ]; then BR=$(post "$B" '{"name":"production"}' | id1); [ -n "$BR" ] || { echo "pg_port=branch-failed"; exit 0; }; curl -fsS -X PUT "$B/$BR/password" -H "$J" -H "$A" -d "{\\"password\\":\\"$PG_PASSWORD\\"}" >/dev/null 2>&1 || true; fi; PORT=$(printf %s "$BRJSON" | port1); [ -n "$PORT" ] || PORT=$(post "$B/$BR/endpoint" '' | port1); echo "pg_port=\${PORT:-unstarted}"`,
          capture: "pgPort",
          capturePattern: "pg_port=([0-9]+)",
          persistAs: {
            key: "NEOND_PG_PORT"
          },
          once: true,
          phase: "post-ready",
          readiness: {
            test: "curl -fsS http://127.0.0.1:3000/api/auth/setup",
            interval: 5000,
            retries: 60
          }
        }
      ],
      connection: {
        title: "Open the Neon console",
        description: "Sign in to the console to manage projects and branches. The install pre-creates the admin account plus a `production` branch with a running endpoint, so the Postgres URL below works immediately.",
        guide: {
          intro: "You get a Neon console for branching plus a normal Postgres connection string for the first branch.",
          useHint: "Each branch gets its own endpoint on its own port. Create a branch in the console, press Start endpoint, and copy that branch's connection string — six host ports (55432-55437) are published for endpoints, which is three concurrent branches.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "console",
            label: "Neon console",
            source: "publicUrl:neond",
            kind: "url",
            recommended: true,
            help: "Sign in with the admin email and password below."
          },
          {
            id: "adminEmail",
            label: "Admin email",
            source: "env:neond:ADMIN_EMAIL",
            help: "The instance admin. Sign-up is closed once this account exists."
          },
          {
            id: "adminPassword",
            label: "Admin password",
            source: "env:neond:ADMIN_PASSWORD",
            secret: true
          },
          {
            id: "dbUrl",
            label: "Database URL",
            source: "template:postgresql://postgres:{{env:neond:PG_PASSWORD}}@{{host}}:{{env:neond:NEOND_PG_PORT}}/postgres?sslmode=require",
            secret: true,
            envKey: "DATABASE_URL",
            help: "The `production` branch endpoint. Neon assigns each endpoint its own port, so if this shows no port the endpoint has not started yet — open the console and press Start endpoint, then read the connection string there."
          }
        ],
        firstLogin: {
          note: `The admin account is created during install — use the email and password above. First boot initialises two embedded Postgres instances and can take a couple of minutes after a ~1.2 GB image pull.

Two things worth knowing, both upstream behaviour: if the console shows a branch as running but connections fail, stop and start that endpoint from the console — restarting the container can leave a stale compute lock behind while the API still reports it healthy. And if the container is killed hard (out of memory, power loss) it can refuse to boot with "lease already held"; delete neon_daemon_data/.lock inside the app's volume while nothing is running. An ordinary redeploy is safe — it shuts down gracefully and releases the lock.`
        }
      },
      endpoints: [
        {
          service: "neond",
          port: 3000,
          label: "Console",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      available: true,
      verified: false,
      minEngine: "0.6.6",
      minResources: {
        memoryMb: 16384,
        cpuCores: 4
      },
      id: "posthog",
      name: "PostHog",
      description: "Self-hosted PostHog — product analytics, session replay, and feature flags, with real event ingestion. This mirrors PostHog's own hobby topology: a Caddy path router in front of the Django app, the Rust capture/flags/hypercache/persons services, the Node ingestion consumers, ClickHouse + Kafka + Postgres + Redis + Valkey + S3. Heavy: 21 containers, roughly 4 vCPU / 16 GB RAM and 30+ GB disk. PostHog ships no tagged releases for self-hosting and rebuilds `latest` hourly, so this tracks a moving upstream.",
      repository: "https://github.com/PostHog/posthog",
      kind: "template",
      logo: "posthog",
      category: "analytics",
      tags: [
        "analytics",
        "product-analytics",
        "events",
        "session-replay",
        "feature-flags"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "proxy",
          image: "caddy:2.10-alpine",
          exposed: true,
          exposedPort: 80,
          routes: [
            {
              port: 80
            }
          ],
          dependsOn: [
            "web",
            "capture",
            "replay-capture",
            "feature-flags",
            "hypercache-server",
            "plugins",
            "objectstorage"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget --no-verbose --tries=1 --spider http://127.0.0.1:80/kraft-health || exit 1"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 12,
            startPeriod: "60s"
          },
          restart: "unless-stopped"
        },
        {
          name: "db",
          image: "postgres:15.12-alpine",
          environment: {
            POSTGRES_USER: "posthog",
            POSTGRES_DB: "posthog"
          },
          secretEnv: [
            "POSTGRES_PASSWORD"
          ],
          volumes: [
            "posthog_pgdata:/var/lib/postgresql/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "pg_isready -U posthog"
            ],
            interval: "5s",
            timeout: "30s",
            retries: 30,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        },
        {
          name: "redis7",
          image: "redis:7.2-alpine",
          commandArgv: [
            "redis-server",
            "--maxmemory-policy",
            "allkeys-lru",
            "--maxmemory",
            "200mb"
          ],
          volumes: [
            "posthog_redis:/data"
          ],
          healthcheck: {
            test: [
              "CMD",
              "redis-cli",
              "ping"
            ],
            interval: "3s",
            timeout: "10s",
            retries: 10
          },
          restart: "unless-stopped"
        },
        {
          name: "valkey",
          image: "valkey/valkey:8.1-alpine",
          commandArgv: [
            "valkey-server",
            "--maxmemory-policy",
            "allkeys-lru",
            "--maxmemory",
            "200mb"
          ],
          healthcheck: {
            test: [
              "CMD",
              "valkey-cli",
              "ping"
            ],
            interval: "3s",
            timeout: "10s",
            retries: 10
          },
          restart: "unless-stopped"
        },
        {
          name: "zookeeper",
          image: "zookeeper:3.7.0",
          environment: {
            ZOO_AUTOPURGE_PURGEINTERVAL: "1",
            ZOO_AUTOPURGE_SNAPRETAINCOUNT: "3"
          },
          volumes: [
            "posthog_zk_data:/data",
            "posthog_zk_datalog:/datalog",
            "posthog_zk_logs:/logs"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "echo ruok | nc -w 2 localhost 2181 | grep -q imok"
            ],
            interval: "5s",
            timeout: "10s",
            retries: 20,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        },
        {
          name: "kafka",
          image: "apache/kafka:4.1.0",
          environment: {
            KAFKA_NODE_ID: "1",
            KAFKA_PROCESS_ROLES: "broker,controller",
            KAFKA_LISTENERS: "PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093",
            KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092",
            KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT",
            KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER",
            KAFKA_INTER_BROKER_LISTENER_NAME: "PLAINTEXT",
            KAFKA_CONTROLLER_QUORUM_VOTERS: "1@kafka:9093",
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1",
            KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1",
            KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1",
            KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0",
            KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true",
            KAFKA_NUM_PARTITIONS: "1",
            KAFKA_DEFAULT_REPLICATION_FACTOR: "1",
            KAFKA_LOG_RETENTION_HOURS: "1",
            KAFKA_LOG_DIRS: "/var/lib/kafka/data"
          },
          volumes: [
            "posthog_kafka:/var/lib/kafka/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 >/dev/null 2>&1 || exit 1"
            ],
            interval: "5s",
            timeout: "10s",
            retries: 30,
            startPeriod: "20s"
          },
          restart: "unless-stopped"
        },
        {
          name: "clickhouse",
          image: "clickhouse/clickhouse-server:26.6.2.158",
          dependsOn: [
            "zookeeper",
            "kafka"
          ],
          environment: {
            CLICKHOUSE_SKIP_USER_SETUP: "1",
            KAFKA_HOSTS: "kafka:9092"
          },
          volumes: [
            "posthog_clickhouse:/var/lib/clickhouse"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget --no-verbose --tries=1 --spider http://localhost:8123/ping || exit 1"
            ],
            interval: "3s",
            timeout: "10s",
            retries: 30,
            startPeriod: "20s"
          },
          restart: "unless-stopped"
        },
        {
          name: "objectstorage",
          image: "chrislusf/seaweedfs:4.29",
          environment: {
            S3_BUCKET: "posthog,ducklake-dev,ai-blobs"
          },
          volumes: [
            "posthog_objectstorage:/data"
          ],
          restart: "unless-stopped"
        },
        {
          name: "web",
          image: "posthog/posthog:981043994a4ea60236299d285bcef99d2069f296",
          commandArgv: [
            "sh",
            "-c",
            "./bin/migrate && exec ./bin/docker-server"
          ],
          dependsOn: [
            "db",
            "redis7",
            "clickhouse",
            "kafka",
            "objectstorage",
            "personhog-router"
          ],
          environment: {
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DB_WRITER_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DB_READER_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PGHOST: "db",
            PGUSER: "posthog",
            PGPASSWORD: "{{config:POSTGRES_PASSWORD}}",
            CLICKHOUSE_HOST: "clickhouse",
            CLICKHOUSE_DATABASE: "posthog",
            CLICKHOUSE_SECURE: "false",
            CLICKHOUSE_VERIFY: "false",
            CLICKHOUSE_API_USER: "api",
            CLICKHOUSE_API_PASSWORD: "apipass",
            CLICKHOUSE_APP_USER: "app",
            CLICKHOUSE_APP_PASSWORD: "apppass",
            CLICKHOUSE_BILLING_USER: "billing",
            CLICKHOUSE_BILLING_PASSWORD: "billingpass",
            CLICKHOUSE_DICT_READER_USER: "dict_reader",
            CLICKHOUSE_DICT_READER_PASSWORD: "dictreaderpass",
            CLICKHOUSE_LOGS_CLUSTER_HOST: "clickhouse",
            CLICKHOUSE_LOGS_CLUSTER_SECURE: "false",
            REDIS_URL: "redis://redis7:6379/",
            KAFKA_HOSTS: "kafka",
            DEPLOYMENT: "hobby",
            SECRET_KEY: "{{config:POSTHOG_SECRET}}",
            SITE_URL: "{{publicUrl:proxy}}",
            IS_BEHIND_PROXY: "true",
            DISABLE_SECURE_SSL_REDIRECT: "true",
            OTEL_SDK_DISABLED: "true",
            OPT_OUT_CAPTURE: "false",
            FLAGS_REDIS_ENABLED: "false",
            FEATURE_FLAGS_SERVICE_URL: "http://feature-flags:3001",
            CDP_API_URL: "http://plugins:6738",
            RECORDING_API_URL: "http://recording-api:6738",
            PERSONHOG_ADDR: "personhog-router:50052",
            PERSONHOG_ENABLED: "true",
            OBJECT_STORAGE_ENABLED: "true",
            OBJECT_STORAGE_ENDPOINT: "http://objectstorage:8333",
            OBJECT_STORAGE_PUBLIC_ENDPOINT: "{{publicUrl:proxy}}",
            OBJECT_STORAGE_FORCE_PATH_STYLE: "true",
            OBJECT_STORAGE_BUCKET: "posthog",
            OBJECT_STORAGE_ACCESS_KEY_ID: "posthog",
            OBJECT_STORAGE_SECRET_ACCESS_KEY: "posthog",
            SESSION_RECORDING_V2_S3_ENDPOINT: "http://objectstorage:8333",
            SESSION_RECORDING_V2_S3_ACCESS_KEY_ID: "any",
            SESSION_RECORDING_V2_S3_SECRET_ACCESS_KEY: "any"
          },
          secretEnv: [
            "DATABASE_URL",
            "PERSONS_DB_WRITER_URL",
            "PERSONS_DB_READER_URL",
            "PGPASSWORD",
            "SECRET_KEY"
          ],
          restart: "unless-stopped"
        },
        {
          name: "worker",
          image: "posthog/posthog:981043994a4ea60236299d285bcef99d2069f296",
          commandArgv: [
            "./bin/docker-worker-celery",
            "--with-scheduler"
          ],
          dependsOn: [
            "db",
            "redis7",
            "clickhouse",
            "kafka",
            "objectstorage",
            "web",
            "personhog-router"
          ],
          environment: {
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DB_WRITER_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DB_READER_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PGHOST: "db",
            PGUSER: "posthog",
            PGPASSWORD: "{{config:POSTGRES_PASSWORD}}",
            CLICKHOUSE_HOST: "clickhouse",
            CLICKHOUSE_DATABASE: "posthog",
            CLICKHOUSE_SECURE: "false",
            CLICKHOUSE_VERIFY: "false",
            CLICKHOUSE_API_USER: "api",
            CLICKHOUSE_API_PASSWORD: "apipass",
            CLICKHOUSE_APP_USER: "app",
            CLICKHOUSE_APP_PASSWORD: "apppass",
            CLICKHOUSE_BILLING_USER: "billing",
            CLICKHOUSE_BILLING_PASSWORD: "billingpass",
            CLICKHOUSE_DICT_READER_USER: "dict_reader",
            CLICKHOUSE_DICT_READER_PASSWORD: "dictreaderpass",
            CLICKHOUSE_LOGS_CLUSTER_HOST: "clickhouse",
            CLICKHOUSE_LOGS_CLUSTER_SECURE: "false",
            REDIS_URL: "redis://redis7:6379/",
            KAFKA_HOSTS: "kafka",
            DEPLOYMENT: "hobby",
            POSTHOG_SKIP_MIGRATION_CHECKS: "1",
            SECRET_KEY: "{{config:POSTHOG_SECRET}}",
            SITE_URL: "{{publicUrl:proxy}}",
            IS_BEHIND_PROXY: "true",
            DISABLE_SECURE_SSL_REDIRECT: "true",
            OTEL_SDK_DISABLED: "true",
            FLAGS_REDIS_ENABLED: "false",
            FEATURE_FLAGS_SERVICE_URL: "http://feature-flags:3001",
            CDP_API_URL: "http://plugins:6738",
            RECORDING_API_URL: "http://recording-api:6738",
            PERSONHOG_ADDR: "personhog-router:50052",
            PERSONHOG_ENABLED: "true",
            OBJECT_STORAGE_ENABLED: "true",
            OBJECT_STORAGE_ENDPOINT: "http://objectstorage:8333",
            OBJECT_STORAGE_PUBLIC_ENDPOINT: "{{publicUrl:proxy}}",
            OBJECT_STORAGE_FORCE_PATH_STYLE: "true",
            OBJECT_STORAGE_BUCKET: "posthog",
            OBJECT_STORAGE_ACCESS_KEY_ID: "posthog",
            OBJECT_STORAGE_SECRET_ACCESS_KEY: "posthog",
            SESSION_RECORDING_V2_S3_ENDPOINT: "http://objectstorage:8333",
            SESSION_RECORDING_V2_S3_ACCESS_KEY_ID: "any",
            SESSION_RECORDING_V2_S3_SECRET_ACCESS_KEY: "any"
          },
          secretEnv: [
            "DATABASE_URL",
            "PERSONS_DB_WRITER_URL",
            "PERSONS_DB_READER_URL",
            "PGPASSWORD",
            "SECRET_KEY"
          ],
          restart: "unless-stopped"
        },
        {
          name: "capture",
          image: "ghcr.io/posthog/posthog/capture:master",
          dependsOn: [
            "kafka",
            "redis7"
          ],
          environment: {
            ADDRESS: "0.0.0.0:3000",
            CAPTURE_MODE: "events",
            KAFKA_TOPIC: "events_plugin_ingestion",
            KAFKA_HOSTS: "kafka:9092",
            REDIS_URL: "redis://redis7:6379/",
            RUST_LOG: "info,rdkafka=warn",
            CAPTURE_V1_SINKS: "msk",
            CAPTURE_V1_SINK_MSK_KAFKA_HOSTS: "kafka:9092",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_MAIN: "events_plugin_ingestion",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_HISTORICAL: "events_plugin_ingestion_historical",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_OVERFLOW: "events_plugin_ingestion_overflow",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_DLQ: "events_plugin_ingestion_dlq",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_EXCEPTION: "ingestion-errortracking-main",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_HEATMAP: "heatmaps_ingestion",
            CAPTURE_V1_SINK_MSK_KAFKA_TOPIC_CLIENT_INGESTION_WARNING: "ingestion-clientwarnings-main-1"
          },
          restart: "unless-stopped"
        },
        {
          name: "replay-capture",
          image: "ghcr.io/posthog/posthog/capture:master",
          dependsOn: [
            "kafka",
            "redis7"
          ],
          environment: {
            ADDRESS: "0.0.0.0:3000",
            CAPTURE_MODE: "recordings",
            KAFKA_TOPIC: "session_recording_snapshot_item_events",
            KAFKA_HOSTS: "kafka:9092",
            REDIS_URL: "redis://redis7:6379/",
            RUST_LOG: "info,rdkafka=warn"
          },
          restart: "unless-stopped"
        },
        {
          name: "ingestion-general",
          image: "posthog/posthog-node:432099028611707cd8baf191466a4b0b1e75be1f",
          commandArgv: [
            "node",
            "nodejs/dist/index.js"
          ],
          dependsOn: [
            "db",
            "redis7",
            "clickhouse",
            "kafka",
            "objectstorage",
            "personhog-router"
          ],
          environment: {
            PLUGIN_SERVER_MODE: "ingestion-v2-combined",
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            BEHAVIORAL_COHORTS_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            KAFKA_HOSTS: "kafka:9092",
            REDIS_URL: "redis://redis7:6379/",
            CLICKHOUSE_HOST: "clickhouse",
            CLICKHOUSE_DATABASE: "posthog",
            CLICKHOUSE_SECURE: "false",
            CLICKHOUSE_VERIFY: "false",
            COOKIELESS_REDIS_HOST: "redis7",
            COOKIELESS_REDIS_PORT: "6379",
            CDP_REDIS_HOST: "redis7",
            CDP_REDIS_PORT: "6379",
            CDP_VALKEY_HOST: "valkey",
            CDP_VALKEY_PORT: "6379",
            PERSONHOG_ADDR: "personhog-router:50052",
            PERSONHOG_ENABLED: "true",
            AI_BLOB_S3_BUCKET: "ai-blobs",
            AI_BLOB_S3_PREFIX: "aio/",
            AI_BLOB_S3_ENDPOINT: "http://objectstorage:8333",
            AI_BLOB_S3_REGION: "us-east-1",
            AI_BLOB_S3_ACCESS_KEY_ID: "any",
            AI_BLOB_S3_SECRET_ACCESS_KEY: "any",
            AI_BLOB_OFFLOAD_TEAMS: "*"
          },
          secretEnv: [
            "DATABASE_URL",
            "PERSONS_DATABASE_URL",
            "BEHAVIORAL_COHORTS_DATABASE_URL"
          ],
          restart: "unless-stopped"
        },
        {
          name: "ingestion-sessionreplay",
          image: "posthog/posthog-node:432099028611707cd8baf191466a4b0b1e75be1f",
          commandArgv: [
            "node",
            "nodejs/dist/index.js"
          ],
          dependsOn: [
            "db",
            "redis7",
            "kafka",
            "objectstorage"
          ],
          environment: {
            PLUGIN_SERVER_MODE: "recordings-blob-ingestion-v2",
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            KAFKA_HOSTS: "kafka:9092",
            REDIS_URL: "redis://redis7:6379/",
            SESSION_RECORDING_V2_S3_ENDPOINT: "http://objectstorage:8333",
            SESSION_RECORDING_V2_S3_ACCESS_KEY_ID: "any",
            SESSION_RECORDING_V2_S3_SECRET_ACCESS_KEY: "any",
            SESSION_RECORDING_V2_S3_TIMEOUT_MS: "120000",
            CDP_REDIS_HOST: "redis7",
            CDP_REDIS_PORT: "6379",
            CDP_VALKEY_HOST: "valkey",
            CDP_VALKEY_PORT: "6379"
          },
          secretEnv: [
            "DATABASE_URL"
          ],
          restart: "unless-stopped"
        },
        {
          name: "recording-api",
          image: "posthog/posthog-node:432099028611707cd8baf191466a4b0b1e75be1f",
          commandArgv: [
            "node",
            "nodejs/dist/index.js"
          ],
          dependsOn: [
            "db",
            "redis7",
            "clickhouse"
          ],
          environment: {
            PLUGIN_SERVER_MODE: "recording-api",
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            REDIS_URL: "redis://redis7:6379/",
            CLICKHOUSE_HOST: "clickhouse",
            CLICKHOUSE_DATABASE: "posthog",
            CLICKHOUSE_SECURE: "false",
            CLICKHOUSE_VERIFY: "false",
            SESSION_RECORDING_API_REDIS_HOST: "redis7",
            SESSION_RECORDING_API_REDIS_PORT: "6379",
            SESSION_RECORDING_V2_S3_ENDPOINT: "http://objectstorage:8333",
            SESSION_RECORDING_V2_S3_ACCESS_KEY_ID: "any",
            SESSION_RECORDING_V2_S3_SECRET_ACCESS_KEY: "any",
            CDP_REDIS_HOST: "redis7",
            CDP_REDIS_PORT: "6379",
            CDP_VALKEY_HOST: "valkey",
            CDP_VALKEY_PORT: "6379"
          },
          secretEnv: [
            "DATABASE_URL"
          ],
          restart: "unless-stopped"
        },
        {
          name: "feature-flags",
          image: "ghcr.io/posthog/posthog/feature-flags:master",
          dependsOn: [
            "db",
            "redis7"
          ],
          environment: {
            ADDRESS: "0.0.0.0:3001",
            WRITE_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            READ_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_WRITE_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_READ_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            REDIS_URL: "redis://redis7:6379/",
            COOKIELESS_REDIS_HOST: "redis7",
            COOKIELESS_REDIS_PORT: "6379",
            MAXMIND_DB_PATH: "/app/share/GeoLite2-City.mmdb",
            RUST_LOG: "info"
          },
          secretEnv: [
            "WRITE_DATABASE_URL",
            "READ_DATABASE_URL",
            "PERSONS_WRITE_DATABASE_URL",
            "PERSONS_READ_DATABASE_URL"
          ],
          healthcheck: {
            test: [
              "CMD",
              "curl",
              "-f",
              "http://localhost:3001/_readiness"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 12,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        },
        {
          name: "hypercache-server",
          image: "ghcr.io/posthog/posthog/hypercache-server:master",
          dependsOn: [
            "redis7"
          ],
          environment: {
            ADDRESS: "0.0.0.0:3002",
            REDIS_URL: "redis://redis7:6379/",
            RUST_LOG: "info"
          },
          healthcheck: {
            test: [
              "CMD",
              "curl",
              "-f",
              "http://localhost:3002/_readiness"
            ],
            interval: "5s",
            timeout: "5s",
            retries: 12,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        },
        {
          name: "personhog-replica",
          image: "ghcr.io/posthog/posthog/personhog-replica:master",
          dependsOn: [
            "db"
          ],
          environment: {
            GRPC_ADDRESS: "0.0.0.0:50051",
            PRIMARY_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            METRICS_PORT: "9100",
            RUST_LOG: "info"
          },
          secretEnv: [
            "PRIMARY_DATABASE_URL"
          ],
          restart: "unless-stopped"
        },
        {
          name: "personhog-router",
          image: "ghcr.io/posthog/posthog/personhog-router:master",
          dependsOn: [
            "personhog-replica"
          ],
          environment: {
            GRPC_ADDRESS: "0.0.0.0:50052",
            REPLICA_URL: "http://personhog-replica:50051",
            BACKEND_TIMEOUT_MS: "5000",
            METRICS_PORT: "9101",
            RUST_LOG: "info"
          },
          restart: "unless-stopped"
        },
        {
          name: "property-defs-rs",
          image: "ghcr.io/posthog/posthog/property-defs-rs:master",
          dependsOn: [
            "db",
            "kafka"
          ],
          environment: {
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            KAFKA_HOSTS: "kafka:9092",
            SKIP_WRITES: "false",
            SKIP_READS: "false",
            FILTER_MODE: "opt-out",
            RUST_LOG: "info"
          },
          secretEnv: [
            "DATABASE_URL"
          ],
          restart: "unless-stopped"
        },
        {
          name: "plugins",
          image: "posthog/posthog-node:432099028611707cd8baf191466a4b0b1e75be1f",
          commandArgv: [
            "node",
            "nodejs/dist/index.js"
          ],
          dependsOn: [
            "db",
            "redis7",
            "valkey",
            "clickhouse",
            "kafka",
            "objectstorage"
          ],
          environment: {
            DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            PERSONS_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            BEHAVIORAL_COHORTS_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            CYCLOTRON_DATABASE_URL: "postgres://posthog:{{config:POSTGRES_PASSWORD}}@db:5432/posthog",
            KAFKA_HOSTS: "kafka:9092",
            REDIS_URL: "redis://redis7:6379/",
            CLICKHOUSE_HOST: "clickhouse",
            CLICKHOUSE_DATABASE: "posthog",
            CLICKHOUSE_SECURE: "false",
            CLICKHOUSE_VERIFY: "false",
            SITE_URL: "{{publicUrl:proxy}}",
            SECRET_KEY: "{{config:POSTHOG_SECRET}}",
            CDP_REDIS_HOST: "redis7",
            CDP_REDIS_PORT: "6379",
            CDP_VALKEY_HOST: "valkey",
            CDP_VALKEY_PORT: "6379",
            OBJECT_STORAGE_ENABLED: "true",
            OBJECT_STORAGE_ENDPOINT: "http://objectstorage:8333",
            OBJECT_STORAGE_PUBLIC_ENDPOINT: "{{publicUrl:proxy}}",
            OBJECT_STORAGE_FORCE_PATH_STYLE: "true",
            OBJECT_STORAGE_BUCKET: "posthog",
            OBJECT_STORAGE_ACCESS_KEY_ID: "any",
            OBJECT_STORAGE_SECRET_ACCESS_KEY: "any"
          },
          secretEnv: [
            "DATABASE_URL",
            "PERSONS_DATABASE_URL",
            "BEHAVIORAL_COHORTS_DATABASE_URL",
            "CYCLOTRON_DATABASE_URL",
            "SECRET_KEY"
          ],
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "POSTGRES_PASSWORD",
          service: "db",
          label: "Database password",
          help: "Auto-generated. The Postgres password every PostHog service uses.",
          generate: "secret",
          secret: true
        },
        {
          key: "POSTHOG_SECRET",
          service: "web",
          label: "Django secret key",
          help: "Auto-generated. Signs sessions and cookies (SECRET_KEY).",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      files: [
        {
          service: "proxy",
          path: "/etc/caddy/Caddyfile",
          content: `{
	servers {
		trusted_proxies static 127.0.0.1/32 ::1/128 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16
	}
}

# Host-less site address on purpose. PostHog's own default is
# \`http://localhost:8000\`, which compiles to a Host matcher — behind Kraft's
# edge a foreign Host then returns an empty HTTP 200 instead of a 404, so every
# ingestion POST would look successful while the events were silently dropped.
# \`:80\` also emits no automatic_https and no tls app, so Caddy never tries ACME.
:80 {
	# Health target for the container healthcheck. Deliberately answered by
	# Caddy itself: proxying /_health through to Django would report unhealthy
	# for the whole first-boot migration window and raise a false incident.
	@kraft-health {
		path /kraft-health
	}

	handle @kraft-health {
		respond "ok" 200
	}

	@replay-capture {
		path /s
		path /s/
		path /s/*
	}

	@capture {
		path /e
		path /e/
		path /e/*
		path /i/v0
		path /i/v0/
		path /i/v0/*
		path /i/v1/analytics/events
		path /i/v1/analytics/events/
		path /batch
		path /batch/
		path /batch/*
		path /capture
		path /capture/
		path /capture/*
	}

	@flags {
		path /flags
		path /flags/
		path /flags/*
		path /api/feature_flag/local_evaluation
		path /api/feature_flag/local_evaluation/
		path /api/feature_flag/local_evaluation/*
	}

	@surveys {
		path /surveys
		path /surveys/
		path /api/surveys
		path /api/surveys/
	}

	@remote-config {
		path /array/*
	}

	@webhooks {
		path /public/webhooks
		path /public/webhooks/
		path /public/webhooks/*
		path /public/m/
		path /public/m/*
	}

	@objectstorage {
		path /posthog
		path /posthog/
		path /posthog/*
	}

	handle @capture {
		reverse_proxy capture:3000
	}

	handle @replay-capture {
		reverse_proxy replay-capture:3000
	}

	handle @flags {
		reverse_proxy feature-flags:3001
	}

	handle @surveys {
		reverse_proxy hypercache-server:3002
	}

	handle @remote-config {
		reverse_proxy hypercache-server:3002
	}

	handle @webhooks {
		reverse_proxy plugins:6738
	}

	handle @objectstorage {
		reverse_proxy objectstorage:8333
	}

	handle {
		reverse_proxy web:8000
	}
}
`
        },
        {
          service: "clickhouse",
          path: "/etc/clickhouse-server/config.d/kraft-posthog.xml",
          content: `<clickhouse>
  <!-- PostHog creates every table as ReplicatedMergeTree ON CLUSTER, so the
       macros, the clusters and ZooKeeper must all resolve or migrate_clickhouse
       cannot create a single table. Shipped as a config.d overlay rather than a
       replacement config.xml so the image's own defaults still apply. -->
  <zookeeper>
    <node>
      <host>zookeeper</host>
      <port>2181</port>
    </node>
  </zookeeper>
  <macros>
    <shard>01</shard>
    <replica>ch1</replica>
  </macros>
  <distributed_ddl>
    <path>/clickhouse/task_queue/ddl</path>
  </distributed_ddl>
  <!-- ~95 Kafka-engine tables each hold a background schedule slot. -->
  <background_schedule_pool_size>256</background_schedule_pool_size>
  <format_schema_path>/var/lib/clickhouse/format_schemas/</format_schema_path>
  <remote_servers>
    <posthog><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></posthog>
    <posthog_single_shard><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></posthog_single_shard>
    <posthog_migrations><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></posthog_migrations>
    <posthog_writable><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></posthog_writable>
    <posthog_primary_replica><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></posthog_primary_replica>
    <ai_events><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></ai_events>
    <aux><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></aux>
    <ops><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></ops>
    <sessions><shard><replica><host>clickhouse</host><port>9000</port></replica></shard></sessions>
  </remote_servers>
  <!-- PostHog's Kafka tables reference a named collection, not a broker list. -->
  <named_collections>
    <msk_cluster><kafka_broker_list from_env="KAFKA_HOSTS"/></msk_cluster>
    <warpstream_ingestion><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_ingestion>
    <warpstream_calculated_events><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_calculated_events>
    <warpstream_replay><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_replay>
    <warpstream_shared><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_shared>
    <warpstream_cyclotron><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_cyclotron>
    <warpstream_logs><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_logs>
    <warpstream_traces><kafka_broker_list from_env="KAFKA_HOSTS"/></warpstream_traces>
  </named_collections>
</clickhouse>
`
        },
        {
          service: "clickhouse",
          path: "/etc/clickhouse-server/users.d/kraft-posthog.xml",
          content: `<clickhouse>
  <!-- CLICKHOUSE_SKIP_USER_SETUP=1 means the image creates no users, but the
       Django app connects as api/app/billing/dict_reader on different query
       paths. Passwords match the values the app is configured with; ClickHouse
       is never published outside the project network. -->
  <profiles>
    <default>
      <max_memory_usage>10000000000</max_memory_usage>
      <use_uncompressed_cache>0</use_uncompressed_cache>
      <load_balancing>random</load_balancing>
    </default>
  </profiles>
  <users>
    <default>
      <password></password>
      <networks><ip>::/0</ip></networks>
      <profile>default</profile>
      <quota>default</quota>
      <access_management>1</access_management>
    </default>
    <api>
      <password>apipass</password>
      <networks><ip>::/0</ip></networks>
      <profile>default</profile>
      <quota>default</quota>
    </api>
    <app>
      <password>apppass</password>
      <networks><ip>::/0</ip></networks>
      <profile>default</profile>
      <quota>default</quota>
    </app>
    <billing>
      <password>billingpass</password>
      <networks><ip>::/0</ip></networks>
      <profile>default</profile>
      <quota>default</quota>
    </billing>
    <dict_reader>
      <password>dictreaderpass</password>
      <networks><ip>::/0</ip></networks>
      <profile>default</profile>
      <quota>default</quota>
    </dict_reader>
  </users>
  <quotas>
    <default><interval><duration>3600</duration></interval></default>
  </quotas>
</clickhouse>
`
        }
      ],
      prepare: [
        {
          service: "kafka",
          title: "Create Kafka topics",
          description: "Pre-creates the ingestion topics the Node consumers verify at startup.",
          command: 'for t in events_plugin_ingestion events_plugin_ingestion_historical events_plugin_ingestion_overflow events_plugin_ingestion_dlq events_plugin_ingestion_ai events_plugin_ingestion_async session_recording_snapshot_item_events clickhouse_events_json clickhouse_ai_events_json clickhouse_heatmap_events clickhouse_flag_evaluations clickhouse_ingestion_warnings clickhouse_groups clickhouse_person clickhouse_person_distinct_id clickhouse_person_distinct_id2 clickhouse_person_overrides clickhouse_app_metrics2 clickhouse_session_replay_events clickhouse_session_recording_events clickhouse_tophog heatmaps_ingestion ingestion-clientwarnings-main-1 ingestion-errortracking-main log_entries plugin_log_entries events_dead_letter_queue; do /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic "$t" --partitions 1 --replication-factor 1 >/dev/null 2>&1 || true; done; echo done',
          capture: "topics",
          phase: "post-ready",
          readiness: {
            test: "/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092",
            interval: 3000,
            retries: 30
          }
        }
      ],
      connection: {
        title: "Open PostHog",
        description: "Open the PostHog UI and create your admin account on first load. The same hostname serves the UI and the event-ingestion endpoints, so an SDK pointed at this URL works with no extra configuration.",
        guide: {
          intro: "PostHog runs its own analytics UI — create the admin account when you first open it, then use the project API key it gives you in your SDK.",
          useHint: "Point your SDK's host at this URL. Caddy routes /e, /capture, /batch and /i/* to the capture service, /s/* to session replay, /flags to feature flags, and everything else to the app.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "ui",
            label: "PostHog",
            source: "publicUrl:proxy",
            kind: "url",
            recommended: true,
            help: "PostHog has no default login — the first visitor creates the admin account. This host also receives your events."
          }
        ],
        firstLogin: {
          note: "PostHog ships no default credentials — open the URL above and sign up to create the first (admin) account. First boot runs database migrations and can take several minutes before the UI answers."
        }
      },
      endpoints: [
        {
          service: "proxy",
          port: 80,
          label: "PostHog",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      available: true,
      verified: false,
      minEngine: "0.6.6",
      id: "redis",
      name: "Valkey (Redis)",
      description: "In-memory data store for caching, sessions, rate limits, and queues — Valkey, the open-source Redis fork. Drop-in Redis-compatible: point any redis client at it. Ships with RedisInsight, a browser UI that arrives already connected to this instance.",
      repository: "https://github.com/valkey-io/valkey",
      kind: "template",
      logo: "valkey",
      category: "database",
      tags: [
        "cache",
        "redis",
        "valkey",
        "key-value",
        "queue",
        "gui"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "valkey",
          image: "valkey/valkey:8.1-alpine",
          commandArgv: [
            "valkey-server"
          ],
          environment: {
            VALKEY_EXTRA_FLAGS: "--requirepass {{config:VALKEY_PASSWORD}} --appendonly yes --appendfsync everysec --save 300 100"
          },
          secretEnv: [
            "VALKEY_EXTRA_FLAGS"
          ],
          volumes: [
            "valkey_data:/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              'valkey-cli ping 2>&1 | grep -q NOAUTH && valkey-cli --no-auth-warning -a "$VALKEY_PASSWORD" ping | grep -q PONG'
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        },
        {
          name: "redisinsight",
          image: "redis/redisinsight:3.8.0",
          exposedPort: 5540,
          exposed: true,
          routes: [
            {
              port: 5540
            }
          ],
          dependsOn: [
            "valkey"
          ],
          environment: {
            RI_ACCEPT_TERMS_AND_CONDITIONS: "true",
            RI_REDIS_HOST: "valkey",
            RI_REDIS_PORT: "6379",
            RI_REDIS_DB: "0",
            RI_REDIS_ALIAS: "Valkey (this app)",
            RI_REDIS_PASSWORD: "{{config:VALKEY_PASSWORD}}"
          },
          secretEnv: [
            "RI_REDIS_PASSWORD"
          ],
          volumes: [
            "redisinsight_data:/data"
          ],
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "VALKEY_PASSWORD",
          service: "valkey",
          label: "Password",
          help: "Auto-generated. Required by every client (Valkey's `requirepass` auth). The bundled browser UI is pre-loaded with it.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Valkey",
        description: "A Redis-compatible endpoint on your project's private network. Point any redis client at the URL below — it already carries the password.",
        guide: {
          intro: "Your project gets a Redis-compatible cache plus a browser UI that is already connected to it.",
          useHint: "Read `process.env.REDIS_URL` in your code — it's set the next time your project deploys.",
          defaultMode: "internal"
        },
        outputs: [
          {
            id: "ui",
            label: "Browser UI",
            source: "publicUrl:redisinsight",
            kind: "url",
            recommended: true,
            help: "RedisInsight, already pointed at this instance — no connection details to enter. It has NO login of its own, so anyone who can reach this address can read and write your data: keep it on the published port (reachable through an SSH tunnel) unless you deliberately put it on a domain you protect.",
            width: "full"
          },
          {
            id: "url",
            label: "Connection URL",
            source: "template:redis://:{{env:valkey:VALKEY_PASSWORD}}@valkey:6379",
            sourceLabel: "Internal",
            service: "valkey",
            secret: true,
            envKey: "REDIS_URL",
            recommended: true,
            help: "Redis-protocol URL with the password embedded, on the project's private network. Port 6379 is not published to the internet — bind this app into another project to use it, or reach it from the server with `docker exec`."
          },
          {
            id: "host",
            label: "Host",
            source: "template:valkey",
            service: "valkey",
            envKey: "REDIS_HOST",
            width: "half"
          },
          {
            id: "port",
            label: "Port",
            source: "template:6379",
            service: "valkey",
            envKey: "REDIS_PORT",
            width: "half"
          },
          {
            id: "password",
            label: "Password",
            source: "env:valkey:VALKEY_PASSWORD",
            secret: true,
            envKey: "REDIS_PASSWORD",
            width: "half"
          }
        ]
      },
      provides: [
        {
          id: "redis",
          outputRefs: [
            "url"
          ],
          category: "database"
        }
      ],
      endpoints: [
        {
          service: "redisinsight",
          port: 5540,
          label: "Browser UI",
          kind: "http",
          scope: "public"
        },
        {
          service: "valkey",
          port: 6379,
          label: "Redis / Valkey (private)",
          kind: "tcp",
          scope: "internal",
          defaultMode: "internal",
          allowedModes: [
            "internal"
          ]
        }
      ]
    },
    {
      available: true,
      verified: true,
      id: "umami",
      name: "Umami",
      description: "Privacy-friendly, cookie-free web analytics — a self-hosted alternative to Google Analytics. Add one script tag to your site and see traffic in a clean dashboard you own.",
      kind: "template",
      logo: "umami",
      category: "analytics",
      tags: [
        "analytics",
        "web-analytics",
        "privacy",
        "statistics"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "umami",
          image: "ghcr.io/umami-software/umami:postgresql-v2.19.0",
          exposedPort: 3000,
          exposed: true,
          routes: [
            {
              port: 3000
            }
          ],
          dependsOn: [
            "umami-db"
          ],
          environment: {
            DATABASE_TYPE: "postgresql",
            DATABASE_URL: "postgresql://umami:{{config:POSTGRES_PASSWORD}}@umami-db:5432/umami"
          },
          secretEnv: [
            "DATABASE_URL"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget -q -O - http://127.0.0.1:3000/api/heartbeat 2>&1 | grep -q ok"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 10,
            startPeriod: "30s"
          },
          restart: "unless-stopped",
          ports: []
        },
        {
          name: "umami-db",
          image: "postgres:16-alpine",
          environment: {
            POSTGRES_DB: "umami",
            POSTGRES_USER: "umami"
          },
          secretEnv: [
            "POSTGRES_PASSWORD"
          ],
          volumes: [
            "umami_db:/var/lib/postgresql/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "pg_isready -U umami -d umami"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 5,
            startPeriod: "10s"
          },
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "POSTGRES_PASSWORD",
          service: "umami-db",
          label: "Database password",
          help: "Auto-generated. The password for Umami's Postgres database.",
          generate: "secret",
          secret: true
        },
        {
          key: "APP_SECRET",
          service: "umami",
          label: "App secret",
          help: "Auto-generated. Signs Umami's session tokens — keep it stable.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to Umami",
        description: "Open the Umami dashboard and sign in, then add your website to get its tracking script.",
        guide: {
          intro: "Your project gets a self-hosted Umami analytics dashboard.",
          useHint: "Sign in, add your website under Settings → Websites, and paste the tracking snippet into your site's <head>."
        },
        firstLogin: {
          username: "admin",
          password: "umami",
          note: "Change this password immediately from Settings → Profile after your first sign-in."
        },
        outputs: [
          {
            id: "dashboard",
            label: "Dashboard",
            source: "publicUrl:umami",
            kind: "url",
            envKey: "UMAMI_URL",
            recommended: true,
            help: "Sign in with the username + password below."
          }
        ]
      },
      endpoints: [
        {
          service: "umami",
          port: 3000,
          label: "Dashboard",
          kind: "http"
        },
        {
          service: "umami-db",
          port: 5432,
          label: "Database",
          kind: "tcp"
        }
      ]
    },
    {
      available: true,
      verified: true,
      unlisted: true,
      id: "webmail",
      name: "Kraft Webmail",
      description: "A fast, self-hosted webmail client. Point it at any IMAP/SMTP mailbox — an Kraft Mail server, Gmail, Fastmail, or your company's — and read, search and send from a clean UI on your own domain. Nothing is stored outside your server.",
      kind: "template",
      logo: "webmail",
      category: "mail",
      tags: [
        "mail",
        "webmail",
        "email",
        "imap",
        "smtp"
      ],
      framework: "docker-compose",
      repository: "https://github.com/Mail-0/Zero",
      services: [
        {
          name: "webmail",
          image: "ghcr.io/rakay-technology/kraft-webmail:latest",
          exposedPort: 4080,
          exposed: true,
          volumes: [
            "webmail_data:/data"
          ],
          environment: {
            TRUSTED_ORIGINS: "{{publicUrl:webmail}}"
          },
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "SESSION_ENCRYPTION_KEY",
          service: "webmail",
          label: "Session encryption key",
          help: "Auto-generated (32 random bytes, hex). Encrypts each signed-in user's IMAP password at rest. Changing it signs everyone out; they just sign in again.",
          generate: "secret",
          secret: true
        },
        {
          key: "BRANDING_ADMIN_TOKEN",
          service: "webmail",
          label: "Branding admin token",
          help: "Auto-generated. Lets Kraft write this webmail's white-label login page (logo, name, colors) over its admin API. Nothing else accepts it.",
          generate: "secret",
          secret: true
        }
      ],
      settings: [
        {
          id: "backend",
          label: "Mail backend",
          description: "Which IMAP/SMTP server this webmail talks to. Leave the hosts blank and each address resolves to mail.<its own domain> at sign-in — the convention Kraft Mail and iRedMail install. Set them to pin every mailbox to one server. Users can still override host and port on the sign-in screen.",
          fields: [
            {
              key: "DEFAULT_IMAP_HOST",
              service: "webmail",
              label: "IMAP host",
              help: "Where mail is read from. Blank → mail.<domain of the address signing in>.",
              type: "text",
              placeholder: "mail.example.com",
              installStep: true,
              requiresRedeploy: true
            },
            {
              key: "DEFAULT_SMTP_HOST",
              service: "webmail",
              label: "SMTP host",
              help: "Where mail is sent through. Blank → mail.<domain of the address signing in>.",
              type: "text",
              placeholder: "mail.example.com",
              installStep: true,
              requiresRedeploy: true
            },
            {
              key: "DEFAULT_IMAP_PORT",
              service: "webmail",
              label: "IMAP port",
              help: "Blank → 993 (IMAPS). TLS is always required.",
              type: "number",
              integer: true,
              min: 1,
              max: 65535,
              placeholder: "993",
              advanced: true,
              installStep: true,
              requiresRedeploy: true
            },
            {
              key: "DEFAULT_SMTP_PORT",
              service: "webmail",
              label: "SMTP port",
              help: "Blank → 587 (submission, STARTTLS). Use 465 for implicit TLS — the port alone selects the mode, and TLS is required either way.",
              type: "number",
              integer: true,
              min: 1,
              max: 65535,
              placeholder: "587",
              advanced: true,
              installStep: true,
              requiresRedeploy: true
            }
          ]
        },
        {
          id: "access",
          label: "Access",
          description: "Where this webmail is reached from. Filled in from the hostname you route it on — override it only when something in front of it changes the origin the browser sees.",
          fields: [
            {
              key: "TRUSTED_ORIGINS",
              service: "webmail",
              label: "Trusted origins",
              help: "Comma-separated origins allowed to sign in — scheme + host, no path. Defaults to this app's own public URL. Set it when the app is served through a proxy Kraft doesn't route, e.g. an Kraft Mail server fronting mail.<domain> for a cloud deploy.",
              type: "text",
              placeholder: "https://mail.example.com",
              advanced: true,
              requiresRedeploy: true
            }
          ]
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Sign in to Webmail",
        description: "Open the webmail URL and sign in with a full email address and its mailbox password. There is no separate account to create — the mailbox on your IMAP server is the account.",
        guide: {
          intro: "Your project runs its own webmail client. It holds no mail: every message is read live from IMAP, and only encrypted session credentials and per-user settings live on disk.",
          useHint: "Webmail is domain-only by design: sessions use Secure cookies, so sign-in never completes over plain http, and the container publishes nothing to the host — the edge reaches it on loopback. Point a hostname at it and TLS is issued automatically.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "webmail",
            label: "Webmail",
            source: "publicUrl:webmail",
            kind: "url",
            envKey: "WEBMAIL_URL",
            recommended: true,
            help: "Sign in with an email address on your mail server and its mailbox password."
          }
        ]
      },
      endpoints: [
        {
          service: "webmail",
          port: 4080,
          label: "Webmail",
          kind: "http",
          defaultMode: "domain",
          allowedModes: [
            "domain"
          ]
        }
      ]
    },
    {
      available: true,
      verified: false,
      minEngine: "0.6.6",
      id: "clickhouse",
      name: "ClickHouse",
      description: "The columnar SQL database for analytics — billions of rows scanned per second. Ships with the CH-UI console, so you get a SQL editor, schema browser and dashboards the moment it installs: sign in with the ClickHouse user and password below, no extra setup.",
      repository: "https://github.com/ClickHouse/ClickHouse",
      kind: "template",
      logo: "clickhouse",
      category: "database",
      tags: [
        "analytics",
        "olap",
        "sql",
        "columnar",
        "warehouse",
        "timeseries"
      ],
      framework: "docker-compose",
      minResources: {
        memoryMb: 2048
      },
      services: [
        {
          name: "clickhouse",
          image: "clickhouse/clickhouse-server:26.3.17.110",
          exposedPort: 8123,
          exposed: true,
          routes: [
            {
              port: 8123
            }
          ],
          environment: {
            CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT: "1"
          },
          secretEnv: [
            "CLICKHOUSE_PASSWORD"
          ],
          volumes: [
            "clickhouse_data:/var/lib/clickhouse"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget -q -O /dev/null http://127.0.0.1:8123/ping || exit 1"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 12,
            startPeriod: "30s"
          },
          restart: "unless-stopped",
          stopGracePeriod: "60s",
          ports: []
        },
        {
          name: "ch-ui",
          image: "ghcr.io/caioricciuti/ch-ui:v2.6.1",
          exposedPort: 3488,
          exposed: true,
          routes: [
            {
              port: 3488
            }
          ],
          dependsOn: [
            "clickhouse"
          ],
          environment: {
            CLICKHOUSE_URL: "http://clickhouse:8123",
            CONNECTION_NAME: "ClickHouse",
            APP_URL: "{{publicUrl:ch-ui}}",
            DATABASE_PATH: "/app/data/ch-ui.db"
          },
          secretEnv: [
            "APP_SECRET_KEY"
          ],
          volumes: [
            "ch_ui_data:/app/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              "wget -q -O /dev/null http://127.0.0.1:3488/health || exit 1"
            ],
            interval: "10s",
            timeout: "5s",
            retries: 6,
            startPeriod: "15s"
          },
          restart: "unless-stopped",
          ports: []
        }
      ],
      configFields: [
        {
          key: "CLICKHOUSE_USER",
          service: "clickhouse",
          label: "Database user",
          help: "The account the server creates on its first boot. It owns the data and is the sign-in for the console.",
          type: "text",
          default: "default",
          required: true
        },
        {
          key: "CLICKHOUSE_PASSWORD",
          service: "clickhouse",
          label: "Password",
          help: "Auto-generated. Set on the account at first boot — it is the console sign-in and the credential every SQL client needs. Without it the server would refuse all non-localhost connections.",
          generate: "secret",
          secret: true
        },
        {
          key: "CLICKHOUSE_DB",
          service: "clickhouse",
          label: "First database",
          help: "Created on the first boot so you can write a table immediately. More can be added from the console.",
          type: "text",
          default: "analytics",
          required: true
        },
        {
          key: "APP_SECRET_KEY",
          service: "ch-ui",
          label: "Console session key",
          help: "Auto-generated. Encrypts the ClickHouse credentials the console holds for a signed-in session. Rotating it signs everyone out.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Connect to ClickHouse",
        description: "Open the console and sign in with the user and password below — the console talks to ClickHouse over the private project network, so the database itself never has to be public. For your own code, use the DSN.",
        guide: {
          intro: "Your project gets a ClickHouse server plus a web console for querying it.",
          useHint: "Read `process.env.CLICKHOUSE_URL` with `CLICKHOUSE_USER` / `CLICKHOUSE_PASSWORD` (or the single `CLICKHOUSE_DSN`) — set on your next deploy.",
          defaultMode: "internal"
        },
        firstLogin: {
          username: "default",
          note: "The console has no account of its own: sign in with the ClickHouse user above and the generated password from this page. Three wrong tries locks that user out for 15 minutes, so paste the password rather than typing it."
        },
        outputs: [
          {
            id: "console",
            label: "Console",
            source: "publicUrl:ch-ui",
            kind: "url",
            recommended: true,
            help: "The CH-UI web console — SQL editor, schema browser, saved queries and dashboards. Sign in with the user and password below."
          },
          {
            id: "httpUrl",
            label: "HTTP endpoint",
            source: "publicUrl:clickhouse",
            sourceLabel: "Public",
            variants: [
              {
                id: "internal",
                label: "Internal",
                source: "template:http://clickhouse:8123"
              }
            ],
            service: "clickhouse",
            envKey: "CLICKHOUSE_URL",
            recommended: true,
            help: "ClickHouse's HTTP interface (port 8123) — what clickhouse-connect, clickhouse-js, the JDBC/ODBC drivers and plain curl talk to. Send the user and password as basic auth. Switch to Internal for apps on the same project network; Public only resolves if you gave this port a domain."
          },
          {
            id: "httpDsn",
            label: "HTTP DSN",
            source: "template:http://{{env:clickhouse:CLICKHOUSE_USER}}:{{env:clickhouse:CLICKHOUSE_PASSWORD}}@clickhouse:8123/{{env:clickhouse:CLICKHOUSE_DB}}",
            sourceLabel: "Internal",
            service: "clickhouse",
            secret: true,
            envKey: "CLICKHOUSE_HTTP_DSN",
            recommended: true,
            help: "One string with the credentials baked in, over the private project network. For a client outside this server, use the public HTTP endpoint above plus the user and password."
          },
          {
            id: "nativeDsn",
            label: "Native TCP DSN",
            source: "template:clickhouse://{{env:clickhouse:CLICKHOUSE_USER}}:{{env:clickhouse:CLICKHOUSE_PASSWORD}}@clickhouse:9000/{{env:clickhouse:CLICKHOUSE_DB}}",
            sourceLabel: "Internal",
            service: "clickhouse",
            secret: true,
            envKey: "CLICKHOUSE_DSN",
            help: "ClickHouse's native protocol (port 9000) — faster and what clickhouse-client, clickhouse-go and clickhouse-driver prefer. Reachable from inside the project only; the port is never published to the host."
          },
          {
            id: "user",
            label: "User",
            source: "env:clickhouse:CLICKHOUSE_USER",
            service: "clickhouse",
            envKey: "CLICKHOUSE_USER",
            recommended: true,
            width: "half"
          },
          {
            id: "password",
            label: "Password",
            source: "env:clickhouse:CLICKHOUSE_PASSWORD",
            service: "clickhouse",
            envKey: "CLICKHOUSE_PASSWORD",
            secret: true,
            recommended: true,
            width: "half"
          },
          {
            id: "database",
            label: "Database",
            source: "env:clickhouse:CLICKHOUSE_DB",
            service: "clickhouse",
            envKey: "CLICKHOUSE_DATABASE",
            width: "half"
          }
        ]
      },
      provides: [
        {
          id: "clickhouse",
          outputRefs: [
            "httpUrl",
            "httpDsn",
            "user",
            "password",
            "database"
          ],
          category: "database"
        }
      ],
      endpoints: [
        {
          service: "ch-ui",
          port: 3488,
          label: "Console",
          kind: "http",
          required: true,
          scope: "public",
          defaultMode: "domain"
        },
        {
          service: "clickhouse",
          port: 8123,
          label: "HTTP API",
          kind: "http",
          scope: "public",
          defaultMode: "port"
        },
        {
          service: "clickhouse",
          port: 9000,
          label: "Native protocol",
          kind: "tcp",
          scope: "internal",
          defaultMode: "internal",
          allowedModes: [
            "internal"
          ]
        }
      ]
    },
    {
      available: true,
      verified: true,
      id: "mindwire",
      name: "MindWire",
      description: "Run coding-agent runtimes behind a self-hosted control plane. MindWire keeps the runtime private and gives you one console to manage agents, credentials, and sessions.",
      repository: "https://github.com/oblien/mindwire",
      kind: "template",
      logo: "mindwire",
      category: "automation",
      tags: [
        "ai",
        "agents",
        "coding",
        "control-plane"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "runtime",
          image: "ghcr.io/oblien/mindwire-runtime:0.1.3",
          environment: {
            ADDR: "0.0.0.0:8790",
            AGENT_TYPE: "claude-code",
            DAEMON_TOKEN: "{{config:MINDWIRE_RUNTIME_TOKEN}}"
          },
          secretEnv: [
            "DAEMON_TOKEN"
          ],
          volumes: [
            "mindwire_runtime:/home/node"
          ],
          restart: "unless-stopped"
        },
        {
          name: "console",
          image: "ghcr.io/oblien/mindwire-console:0.1.3",
          exposedPort: 8787,
          exposed: true,
          routes: [
            {
              port: 8787
            }
          ],
          dependsOn: [
            "runtime"
          ],
          environment: {
            NODE_ENV: "production",
            PORT: "8787",
            BASE_URL: "{{publicUrl:console}}",
            AUTH_DB_PATH: "/data/auth.db",
            CONSOLE_MODE: "self-hosted",
            CONSOLE_USERNAME: "{{config:CONSOLE_USERNAME}}",
            CONSOLE_PASSWORD: "{{config:CONSOLE_PASSWORD}}",
            AUTH_SECRET: "{{config:AUTH_SECRET}}",
            SECRETS_ENCRYPTION_KEY: "{{config:SECRETS_ENCRYPTION_KEY}}",
            ALLOW_LOCAL_RUNTIME: "true",
            ALLOW_SSH_RUNTIME: "true",
            ALLOW_DOCKER_RUNTIME: "true",
            ALLOW_REMOTE_RUNTIME: "true",
            DAEMON_URL: "http://runtime:8790",
            MINDWIRE_RUNTIME_TOKEN: "{{config:MINDWIRE_RUNTIME_TOKEN}}",
            SEED_DEFAULT_DAEMON: "true"
          },
          secretEnv: [
            "CONSOLE_PASSWORD",
            "AUTH_SECRET",
            "SECRETS_ENCRYPTION_KEY",
            "MINDWIRE_RUNTIME_TOKEN"
          ],
          volumes: [
            "mindwire_console:/data"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              `node -e "fetch('http://127.0.0.1:8787/api/ping').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"`
            ],
            interval: "10s",
            timeout: "5s",
            retries: 12,
            startPeriod: "20s"
          },
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "CONSOLE_USERNAME",
          service: "console",
          label: "Console username",
          help: "The single owner account for this self-hosted console.",
          default: "admin",
          required: true
        },
        {
          key: "CONSOLE_PASSWORD",
          service: "console",
          label: "Console password",
          help: "Auto-generated. Use this with the owner username to sign in.",
          type: "password",
          generate: "secret",
          secret: true
        },
        {
          key: "AUTH_SECRET",
          service: "console",
          label: "Session signing secret",
          help: "Auto-generated. Keep it stable so existing sign-in sessions remain valid after upgrades.",
          generate: "secret",
          secret: true
        },
        {
          key: "SECRETS_ENCRYPTION_KEY",
          service: "console",
          label: "Credential vault key",
          help: "Auto-generated 32-byte key used to encrypt provider and runtime credentials at rest.",
          generate: "secret",
          secret: true
        },
        {
          key: "MINDWIRE_RUNTIME_TOKEN",
          service: "runtime",
          label: "Runtime bearer token",
          help: "Auto-generated. Authenticates the Console to the private MindWire runtime.",
          generate: "secret",
          secret: true
        }
      ],
      management: {
        kind: "schema"
      },
      connection: {
        title: "Sign in to MindWire",
        description: "Open the Console and sign in with the generated owner credentials. The runtime stays private to this deployment.",
        guide: {
          intro: "MindWire gives you a production control plane for coding-agent runtimes without exposing the runtime API to the public internet.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "console",
            label: "MindWire Console",
            source: "publicUrl:console",
            kind: "url",
            recommended: true,
            help: "Open the control plane in your browser."
          },
          {
            id: "username",
            label: "Owner username",
            source: "env:console:CONSOLE_USERNAME"
          },
          {
            id: "password",
            label: "Owner password",
            source: "env:console:CONSOLE_PASSWORD",
            secret: true
          }
        ]
      },
      endpoints: [
        {
          service: "console",
          port: 8787,
          label: "MindWire Console",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      $schema: "https://kraft.io/app.schema.json",
      available: true,
      minEngine: "0.6.6",
      id: "pocketbase",
      name: "PocketBase",
      description: "Self-hosted PocketBase with auth, a realtime SQLite database, file storage, and an admin dashboard in one small service.",
      repository: "https://github.com/pocketbase/pocketbase",
      kind: "template",
      logo: "pocketbase",
      category: "backend",
      tags: [
        "auth",
        "database",
        "sqlite",
        "realtime"
      ],
      framework: "docker-compose",
      services: [
        {
          name: "pocketbase",
          build: {
            dockerfile: 'FROM alpine:3.24.1 AS downloader\nARG PB_VERSION=0.40.1\nRUN apk add --no-cache ca-certificates unzip wget \\\n    && ARCH=$(uname -m) \\\n    && case "$ARCH" in x86_64) ARCH=amd64 ;; aarch64) ARCH=arm64 ;; *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;; esac \\\n    && wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/checksums.txt -O /tmp/checksums.txt \\\n    && wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip -O /tmp/pocketbase_${PB_VERSION}_linux_${ARCH}.zip \\\n    && cd /tmp \\\n    && grep " pocketbase_${PB_VERSION}_linux_${ARCH}.zip$" checksums.txt | sha256sum -c - \\\n    && unzip pocketbase_${PB_VERSION}_linux_${ARCH}.zip -d /pb\nFROM alpine:3.24.1\nRUN apk add --no-cache ca-certificates su-exec \\\n    && addgroup -S pocketbase \\\n    && adduser -S -G pocketbase -h /pb pocketbase\nCOPY --chown=pocketbase:pocketbase --from=downloader /pb/pocketbase /pb/pocketbase\nCOPY --chown=pocketbase:pocketbase pocketbase/entrypoint.sh /pb/entrypoint.sh\nRUN chmod 755 /pb/entrypoint.sh\nWORKDIR /pb\nENTRYPOINT ["/pb/entrypoint.sh"]\nCMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--encryptionEnv=PB_ENCRYPTION_KEY"]\n',
            files: [
              {
                path: "entrypoint.sh",
                content: `#!/bin/sh
set -eu
mkdir -p /pb/pb_data
chown pocketbase:pocketbase /pb/pb_data
export PB_ENCRYPTION_KEY="$(printf '%.32s' "$PB_ENCRYPTION_SEED")"
if [ ! -e /pb/pb_data/.kraft-superuser ]; then
  su-exec pocketbase /pb/pocketbase superuser upsert "$POCKETBASE_SUPERUSER_EMAIL" "$POCKETBASE_SUPERUSER_PASSWORD" --dir=/pb/pb_data --encryptionEnv=PB_ENCRYPTION_KEY >/dev/null
  su-exec pocketbase touch /pb/pb_data/.kraft-superuser
fi
exec su-exec pocketbase "$@"
`
              }
            ]
          },
          environment: {
            GOMEMLIMIT: "512MiB"
          },
          secretEnv: [
            "PB_ENCRYPTION_SEED",
            "POCKETBASE_SUPERUSER_PASSWORD"
          ],
          ports: [],
          exposedPort: 8090,
          exposed: true,
          volumes: [
            "pocketbase_data:/pb/pb_data"
          ],
          healthcheck: {
            test: [
              "CMD",
              "wget",
              "-qO-",
              "http://127.0.0.1:8090/api/health"
            ],
            interval: "5s",
            timeout: "3s",
            retries: 20,
            startPeriod: "10s"
          },
          stopGracePeriod: "30s",
          restart: "unless-stopped"
        }
      ],
      configFields: [
        {
          key: "PB_ENCRYPTION_SEED",
          service: "pocketbase",
          label: "Settings encryption seed",
          help: "Derives the stable 32-character key that encrypts PocketBase settings in the data volume.",
          generate: "secret",
          secret: true
        },
        {
          key: "POCKETBASE_SUPERUSER_PASSWORD",
          service: "pocketbase",
          label: "Initial superuser password",
          help: "Auto-generated for the first deployment and shown in the connection card.",
          generate: "secret",
          secret: true
        },
        {
          key: "POCKETBASE_SUPERUSER_EMAIL",
          service: "pocketbase",
          label: "Superuser email",
          help: "Email for the superuser created during the first deployment.",
          type: "text",
          default: "admin@kraft.local",
          required: true
        }
      ],
      connection: {
        title: "Connect to PocketBase",
        description: "Use the public URL from browsers and other projects. The admin dashboard is available at /_/.",
        guide: {
          intro: "PocketBase stores auth, records, and files in one persistent SQLite-backed volume.",
          useHint: "Create scoped credentials for automation, configure off-host backups, and point each app at this URL.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "PocketBase URL",
            source: "publicUrl:pocketbase",
            kind: "url",
            envKey: "POCKETBASE_URL",
            recommended: true
          },
          {
            id: "email",
            label: "Superuser email",
            source: "env:pocketbase:POCKETBASE_SUPERUSER_EMAIL",
            envKey: "POCKETBASE_SUPERUSER_EMAIL"
          },
          {
            id: "password",
            label: "Initial superuser password",
            help: "Use this installation credential until you change the password in PocketBase.",
            source: "env:pocketbase:POCKETBASE_SUPERUSER_PASSWORD",
            envKey: "POCKETBASE_SUPERUSER_PASSWORD",
            secret: true
          }
        ]
      },
      provides: [
        {
          id: "pocketbase",
          outputRefs: [
            "url"
          ],
          category: "database"
        }
      ],
      endpoints: [
        {
          service: "pocketbase",
          port: 8090,
          label: "PocketBase API and dashboard",
          kind: "http",
          defaultMode: "domain"
        }
      ]
    },
    {
      available: true,
      id: "freepbx",
      name: "FreePBX",
      description: "FreePBX 17 with Asterisk 21 — a turnkey PBX for SIP calling, with a web admin panel and MariaDB. SIP (5060/udp) and a reduced RTP media range (10000-10100/udp) publish on all interfaces; email notifications are not configured.",
      kind: "template",
      logo: "freepbx",
      category: "other",
      tags: [
        "voip",
        "pbx",
        "asterisk",
        "sip",
        "telephony"
      ],
      framework: "docker-compose",
      repository: "https://github.com/escomputers/freepbx-docker",
      minResources: {
        memoryMb: 2048,
        cpuCores: 2
      },
      services: [
        {
          name: "db",
          image: "mariadb:10.11",
          environment: {
            MARIADB_ROOT_PASSWORD: "{{config:MYSQL_ROOT_PASSWORD}}",
            MARIADB_USER: "freepbxuser",
            MYSQL_USER: "freepbxuser",
            MARIADB_PASSWORD: "{{config:FREEPBXUSER_PASSWORD}}",
            MYSQL_PASSWORD: "{{config:FREEPBXUSER_PASSWORD}}"
          },
          secretEnv: [
            "MARIADB_ROOT_PASSWORD",
            "MYSQL_ROOT_PASSWORD",
            "MARIADB_PASSWORD",
            "MYSQL_PASSWORD"
          ],
          volumes: [
            "mysql_data:/var/lib/mysql"
          ],
          healthcheck: {
            test: [
              "CMD-SHELL",
              'mariadb-admin ping -h 127.0.0.1 -u root -p"$MARIADB_ROOT_PASSWORD"'
            ],
            interval: "10s",
            timeout: "5s",
            retries: 10,
            startPeriod: "30s"
          },
          restart: "unless-stopped"
        },
        {
          name: "freepbx",
          image: "escomputers/freepbx:17",
          exposed: true,
          exposedPort: 80,
          environment: {
            MYSQL_PASSWORD: "{{config:FREEPBXUSER_PASSWORD}}"
          },
          secretEnv: [
            "MYSQL_PASSWORD"
          ],
          ports: [
            "0.0.0.0:5060:5060/udp",
            "0.0.0.0:10000-10100:10000-10100/udp"
          ],
          volumes: [
            "var_data:/var",
            "etc_data:/etc"
          ],
          dependsOn: [
            "db"
          ],
          restart: "unless-stopped"
        }
      ],
      files: [
        {
          service: "db",
          path: "/docker-entrypoint-initdb.d/init.sql",
          content: `CREATE DATABASE IF NOT EXISTS asterisk;
CREATE DATABASE IF NOT EXISTS asteriskcdrdb;
CREATE USER IF NOT EXISTS 'freepbxuser'@'%' IDENTIFIED BY '{{config:FREEPBXUSER_PASSWORD}}';
ALTER USER 'freepbxuser'@'%' IDENTIFIED BY '{{config:FREEPBXUSER_PASSWORD}}';
GRANT ALL PRIVILEGES ON \`asterisk\`.* TO 'freepbxuser'@'%';
GRANT ALL PRIVILEGES ON \`asteriskcdrdb\`.* TO 'freepbxuser'@'%';
FLUSH PRIVILEGES;`
        },
        {
          service: "db",
          path: "/etc/mysql/my.cnf",
          content: `[mysqld]
sql_mode=NO_ENGINE_SUBSTITUTION`
        },
        {
          service: "freepbx",
          path: "/etc/asterisk/rtp_custom.conf",
          content: `[general]
rtpstart=10000
rtpend=10100
`
        }
      ],
      configFields: [
        {
          key: "MYSQL_ROOT_PASSWORD",
          service: "db",
          label: "MariaDB root password",
          generate: "secret",
          secret: true
        },
        {
          key: "FREEPBXUSER_PASSWORD",
          service: "freepbx",
          label: "FreePBX database user password",
          generate: "secret",
          secret: true
        }
      ],
      endpoints: [
        {
          service: "freepbx",
          port: 80,
          label: "Admin panel",
          kind: "http"
        }
      ],
      prepare: [
        {
          service: "freepbx",
          capture: "freepbx-install",
          phase: "post-ready",
          readiness: {
            test: `php -r '$c=@fsockopen("db",3306); exit($c?0:1);'`,
            interval: 5000,
            retries: 60
          },
          mustSucceed: true,
          once: true,
          persistAs: {
            key: "FREEPBX_INSTALLED"
          },
          command: 'cd /usr/local/src/freepbx && php install -n --dbuser=freepbxuser --dbpass="$MYSQL_PASSWORD" --dbhost=db',
          title: "Install FreePBX core",
          description: "Waits for MariaDB, then runs the FreePBX CLI installer against it."
        }
      ],
      connection: {
        title: "Open FreePBX",
        description: "FreePBX 17 admin panel. Point SIP phones at the server below (UDP 5060; RTP media 10000-10100/udp).",
        guide: {
          intro: "Your project gets a FreePBX PBX with a web admin panel plus SIP on UDP 5060.",
          useHint: "Register SIP phones against the SIP server below. Set the RTP range to 10000-10100 in Asterisk SIP Settings if you change it, and open UDP 5060 + 10000-10100 on the host firewall.",
          defaultMode: "public"
        },
        outputs: [
          {
            id: "url",
            label: "Admin Panel",
            source: "publicUrl:freepbx",
            kind: "url",
            recommended: true
          },
          {
            id: "sip",
            label: "SIP server",
            source: "template:sip:{{host}}:5060",
            help: "Register SIP phones here (UDP 5060, public). RTP media uses 10000-10100/udp — open both ranges on the host firewall."
          }
        ],
        firstLogin: {
          note: "Create the admin account on first visit to the panel. RTP media is limited to 10000-10100/udp (about 50 simultaneous calls) instead of the upstream default 16384-32767 — raise it in Asterisk SIP Settings if you need more, and publish the matching ports. Email notifications are not configured."
        }
      }
    }
  ]
};

// packages/core/src/app-templates.ts
var SECRET_LIKE_KEY_RE = /(?:PASSWORD|PASSWD|PASS\b|SECRET|TOKEN|API[_-]?KEY|PRIVATE[_-]?KEY|ACCESS[_-]?KEY|ENCRYPTION[_-]?KEY|SESSION[_-]?SECRET|CREDENTIAL|SIGNING[_-]?KEY|CLIENT[_-]?SECRET|APP[_-]?SECRET)/i;
var APP_TEMPLATES = catalog_default.apps;
var AVAILABLE_APP_IDS = new Set(APP_TEMPLATES.filter((t) => t.available).map((t) => t.id));

// packages/core/src/apps/blueprint/helpers.ts
var REF_RE = /\$\{([^{}]+)\}/g;
function extractRefs(value) {
  const out = [];
  REF_RE.lastIndex = 0;
  let m;
  while ((m = REF_RE.exec(value)) !== null)
    out.push(m[1].trim());
  return out;
}
var GENERATORS = new Set([
  "domain",
  "password",
  "base64",
  "hash",
  "uuid",
  "randomPort",
  "email",
  "username",
  "timestamp",
  "timestamps",
  "timestampms",
  "jwt"
]);
var ADVANCED = new Set(["publicUrl", "env", "template", "config"]);
function parseRef(expr) {
  const trimmed = expr.trim();
  if (!trimmed || trimmed.includes("${") || trimmed.includes("}")) {
    return { kind: "invalid", expr };
  }
  const head = trimmed.split(":")[0];
  if (ADVANCED.has(head))
    return { kind: "advanced", expr: trimmed };
  if (!GENERATORS.has(head)) {
    if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(trimmed)) {
      return { kind: "var", name: trimmed };
    }
    return { kind: "invalid", expr };
  }
  const idx = trimmed.indexOf(":");
  return {
    kind: "helper",
    helper: head,
    arg: idx === -1 ? undefined : trimmed.slice(idx + 1)
  };
}
function humanize(key) {
  const words = key.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 0)
    return key;
  return words.map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
}
function isSecretLikeKey(key) {
  return SECRET_LIKE_KEY_RE.test(key);
}
function deriveField(varName, raw, usedBy, where) {
  const errors = [];
  const refs = extractRefs(raw);
  if (refs.length === 0) {
    if (raw.length === 0) {
      errors.push(`${where}: variable "${varName}" must be a literal default or exactly one \${...} expression`);
    }
    const secret = isSecretLikeKey(varName);
    return {
      field: {
        key: varName,
        label: humanize(varName),
        services: usedBy,
        required: false,
        type: "text",
        default: raw,
        ...secret ? { secret: true } : {}
      },
      errors
    };
  }
  if (refs.length !== 1 || !raw.trim().startsWith("${") || !raw.trim().endsWith("}")) {
    errors.push(`${where}: variable "${varName}" must be exactly one \${...} expression (got ${JSON.stringify(raw)})`);
    return {
      field: {
        key: varName,
        label: humanize(varName),
        services: usedBy,
        required: true
      },
      errors
    };
  }
  const ref = parseRef(refs[0]);
  const base = {
    key: varName,
    label: humanize(varName),
    services: usedBy,
    required: true
  };
  switch (ref.kind) {
    case "var":
      errors.push(`${where}: variable "${varName}" aliases unknown variable "${ref.name}"`);
      return { field: base, errors };
    case "advanced":
      errors.push(`${where}: variable "${varName}" uses "${ref.expr}" which is not supported in the simplified format — use a direct kraft.json blueprint for advanced sources`);
      return { field: base, errors };
    case "invalid":
      errors.push(`${where}: variable "${varName}" has an unknown helper ${JSON.stringify(ref.expr)}`);
      return { field: base, errors };
    case "helper": {
      const secret = isSecretLikeKey(varName);
      const byHelper = {
        domain: { ...base, type: "text", required: true },
        password: { ...base, generate: "secret", secret: true },
        base64: { ...base, generate: "secret", secret: true },
        hash: { ...base, generate: "secret", secret: true },
        uuid: { ...base, generate: "secret", secret: true },
        randomPort: { ...base, generate: "randomPort" },
        email: { ...base, type: "text", secret: secret || undefined },
        username: { ...base, type: "text", secret: secret || undefined },
        timestamp: { ...base, type: "text" },
        timestamps: { ...base, type: "text" },
        timestampms: { ...base, type: "text" }
      };
      const mapped = byHelper[ref.helper];
      if (mapped)
        return { field: mapped, errors };
      if (ref.helper === "jwt") {
        errors.push(`${where}: variable "${varName}" uses \${jwt:...} which needs an explicit signing group — use a direct kraft.json blueprint with generate:"jwt" + jwtSecretGroup`);
        return { field: base, errors };
      }
      errors.push(`${where}: variable "${varName}" has an unknown helper ${JSON.stringify(ref.helper)}`);
      return { field: base, errors };
    }
  }
}

// packages/core/src/apps/blueprint/converter.ts
var BLUEPRINT_CATEGORIES = [
  "backend",
  "database",
  "cms",
  "mail",
  "analytics",
  "automation",
  "other"
];
function parseMeta(text, dirId) {
  const errors = [];
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    return {
      meta: null,
      errors: [`meta.json: invalid JSON (${err.message})`]
    };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { meta: null, errors: ["meta.json: must be a single JSON object"] };
  }
  const r = raw;
  const need = (key) => {
    const v = r[key];
    if (typeof v !== "string" || v.length === 0) {
      errors.push(`meta.json: missing required field "${key}"`);
      return null;
    }
    return v;
  };
  const id = need("id");
  const name = need("name");
  const description = need("description");
  const version = need("version");
  const logo = need("logo");
  if (id !== null && id !== dirId) {
    errors.push(`meta.json: "id" must be "${dirId}" (got ${JSON.stringify(id)})`);
  }
  const categoryRaw = r["category"];
  if (typeof categoryRaw !== "string" || !BLUEPRINT_CATEGORIES.includes(categoryRaw)) {
    errors.push(`meta.json: category must be one of ${BLUEPRINT_CATEGORIES.join("|")}`);
  }
  const tags = r["tags"];
  if (!Array.isArray(tags) || tags.length === 0 || tags.some((t) => typeof t !== "string")) {
    errors.push("meta.json: tags must be a non-empty array of strings");
  }
  const links = r["links"];
  if (typeof links !== "object" || links === null || Array.isArray(links)) {
    errors.push("meta.json: links must be an object with github, website, docs");
  } else {
    for (const key of ["github", "website", "docs"]) {
      const v = links[key];
      if (typeof v !== "string") {
        errors.push(`meta.json: links is missing required field "${key}"`);
      }
    }
  }
  if (errors.length > 0 || !id || !name || !description || !version || !logo) {
    return { meta: null, errors };
  }
  const linksRec = links;
  return {
    meta: {
      id,
      name,
      description,
      version,
      logo,
      category: categoryRaw,
      tags: tags.slice(),
      links: {
        github: linksRec["github"],
        website: linksRec["website"],
        docs: linksRec["docs"]
      },
      repository: typeof r["repository"] === "string" ? r["repository"] : undefined
    },
    errors
  };
}
function makePlacer(domainBindings) {
  return (value) => value.replace(/\$\{([^{}]+)\}/g, (_m, expr) => {
    const ref = parseRef(String(expr).trim());
    if (ref.kind !== "var")
      return `\${${String(expr).trim()}}`;
    const bound = domainBindings[ref.name];
    return bound !== undefined ? `{{publicUrl:${bound}}}` : `{{config:${ref.name}}}`;
  });
}
function convertSimplified(meta, services, toml, usedBy, nowIso = new Date().toISOString()) {
  const errors = [];
  const warnings = [];
  const svcByName = new Map(services.map((s) => [s.name, s]));
  const domainBindings = {};
  for (const [varName, raw] of Object.entries(toml.variables)) {
    if (raw.trim() !== "${domain}")
      continue;
    const bound = new Set(toml.routes.filter((r) => r.host !== undefined && extractRefs(r.host).includes(varName)).map((r) => r.service));
    if (bound.size === 0) {
      errors.push(`blueprint.toml variables.${varName}: \${domain} is not used by any route host — remove it or add a route`);
    } else if (bound.size > 1) {
      errors.push(`blueprint.toml variables.${varName}: \${domain} is shared by routes of several services (${[...bound].join(", ")}) — use one domain variable per service`);
    } else {
      domainBindings[varName] = [...bound][0];
    }
  }
  const toPlaceholders = makePlacer(domainBindings);
  const configFields = [];
  const secretVars = new Set;
  for (const [varName, raw] of Object.entries(toml.variables)) {
    if (domainBindings[varName] !== undefined)
      continue;
    const owners = (usedBy[varName] ?? []).filter((s) => svcByName.has(s));
    const selfOwners = owners.filter((o) => {
      const env = svcByName.get(o)?.environment ?? {};
      return Object.entries(env).some(([k, v]) => k === varName && v.trim() === `\${${varName}}`);
    });
    const owner = selfOwners[0] ?? owners.find((o) => o !== "__env__") ?? services[0].name;
    const { field, errors: fieldErrors } = deriveField(varName, raw, [owner], "blueprint.toml variables");
    errors.push(...fieldErrors);
    if (fieldErrors.length > 0)
      continue;
    if (field.secret || field.generate === "secret")
      secretVars.add(varName);
    configFields.push({
      key: field.key,
      service: owner,
      label: field.label,
      ...field.type ? { type: field.type } : {},
      ...field.generate ? { generate: field.generate } : {},
      ...field.secret ? { secret: field.secret } : {},
      ...field.default ? { default: field.default } : {},
      required: field.required
    });
  }
  const refsSecretVar = (value) => extractRefs(value).some((e) => {
    const ref = parseRef(e);
    return ref.kind === "var" && secretVars.has(ref.name);
  });
  const outServices = services.map((s) => {
    const environment = {};
    const secretEnv = [];
    for (const [k, v] of Object.entries(s.environment)) {
      environment[k] = toPlaceholders(v);
      if ((isSecretLikeKey(k) || refsSecretVar(v)) && !secretEnv.includes(k)) {
        secretEnv.push(k);
      }
    }
    return {
      name: s.name,
      image: s.image,
      ports: [],
      exposed: false,
      environment,
      ...secretEnv.length > 0 ? { secretEnv } : {},
      volumes: s.volumes.length > 0 ? [...s.volumes] : undefined,
      dependsOn: s.dependsOn.length > 0 ? [...s.dependsOn] : undefined,
      ...s.restart ? { restart: s.restart } : {},
      ...s.healthcheck ? { healthcheck: s.healthcheck } : {},
      ...s.command ? { command: s.command } : {}
    };
  });
  const endpoints = [];
  toml.routes.forEach((r, i) => {
    const where = `blueprint.toml routes[${i}]`;
    const svc = svcByName.get(r.service);
    if (!svc) {
      errors.push(`${where}: unknown service "${r.service}"`);
      return;
    }
    const kind = r.kind ?? "http";
    const defaultMode = r.mode ?? (kind === "http" ? "domain" : "publish");
    if (kind === "http" && r.host === undefined && defaultMode === "domain") {
      errors.push(`${where}: http routes with mode "domain" need host = "\${...}"`);
      return;
    }
    const needsExpose = !(kind === "tcp" && defaultMode === "internal");
    if (needsExpose && !svc.expose.includes(r.port)) {
      errors.push(`${where}: port ${r.port} is not in services.${r.service} expose: — the edge can only route exposed container ports`);
      return;
    }
    const out = outServices.find((s) => s.name === r.service);
    if (kind === "http" && defaultMode === "domain") {
      out.exposed = true;
      if (out.exposedPort === undefined)
        out.exposedPort = r.port;
      else if (out.exposedPort !== r.port) {
        out.routes = [...out.routes ?? [], { port: r.port }];
      }
    }
    endpoints.push({
      service: r.service,
      port: r.port,
      label: r.label ?? humanize(`${r.service} ${r.port}`),
      kind,
      defaultMode
    });
  });
  const envOwners = new Map;
  for (const key of Object.keys(toml.env)) {
    const owners = new Set;
    for (const expr of extractRefs(toml.env[key])) {
      const ref = parseRef(expr);
      if (ref.kind === "var") {
        for (const s of usedBy[ref.name] ?? []) {
          if (s !== "__env__")
            owners.add(s);
        }
      }
    }
    envOwners.set(key, owners.size === 1 ? [...owners][0] : services[0].name);
  }
  for (const [key, value] of Object.entries(toml.env)) {
    const owner = envOwners.get(key);
    const out = outServices.find((s) => s.name === owner);
    out.environment = {
      ...out.environment ?? {},
      [key]: toPlaceholders(value)
    };
    if (isSecretLikeKey(key) || refsSecretVar(value)) {
      const set = new Set([...out.secretEnv ?? [], key]);
      out.secretEnv = [...set];
    }
  }
  for (const f of configFields) {
    if (!f.secret && f.generate !== "secret")
      continue;
    const out = outServices.find((s) => s.name === f.service);
    if (!(out.secretEnv ?? []).includes(f.key)) {
      out.secretEnv = [...out.secretEnv ?? [], f.key];
    }
  }
  const files = toml.files.map((f) => {
    if (!svcByName.has(f.service)) {
      errors.push(`blueprint.toml files: unknown service "${f.service}"`);
    }
    return {
      service: f.service,
      path: f.path,
      content: toPlaceholders(f.content)
    };
  });
  const outputs = [];
  for (const ep of endpoints) {
    if (ep.kind === "http" && ep.defaultMode === "domain") {
      const id = endpoints.filter((e) => e.kind === "http" && e.defaultMode === "domain").length === 1 ? "url" : `url_${ep.service}_${ep.port}`;
      outputs.push({
        id,
        label: endpoints.length > 1 ? `${ep.label} URL` : "URL",
        source: `publicUrl:${ep.service}`,
        kind: "url",
        recommended: true
      });
    }
  }
  for (const f of configFields) {
    if (f.secret || f.generate && f.generate !== "randomPort") {
      outputs.push({
        id: f.key.toLowerCase(),
        label: f.label,
        source: `env:${f.service}:${f.key}`,
        secret: true
      });
    }
  }
  const unpinnedImages = services.filter((s) => s.unpinned).map((s) => s.name);
  let available = true;
  if (unpinnedImages.length > 0) {
    available = false;
    warnings.push(`services ${unpinnedImages.join(", ")} use an unpinned image tag — pin a version to make this app available`);
  }
  const template = {
    id: meta.id,
    name: meta.name,
    description: meta.description,
    kind: "template",
    logo: meta.id,
    category: meta.category,
    tags: [...meta.tags],
    framework: "docker-compose",
    services: outServices,
    ...configFields.length > 0 ? { configFields } : {},
    ...endpoints.length > 0 ? { endpoints } : {},
    ...files.length > 0 ? { files } : {},
    ...outputs.length > 0 ? { connection: { title: `Connect to ${meta.name}`, outputs } } : {},
    available,
    updatedAt: nowIso,
    ...meta.repository ? { repository: meta.repository } : {}
  };
  return { template, warnings, errors };
}

// packages/core/src/apps/blueprint/compose.ts
var import_yaml = __toESM(require_dist(), 1);
var FORBIDDEN_SERVICE_KEYS = [
  "ports",
  "container_name",
  "networks",
  "network_mode",
  "privileged",
  "build",
  "extends",
  "devices",
  "cap_add",
  "sysctls"
];
var ALLOWED_RESTART = new Set([
  "no",
  "always",
  "on-failure",
  "unless-stopped"
]);
function parseExposePort(entry) {
  const text = String(entry ?? "").trim();
  const m = /^(\d{1,5})(?:\/(tcp|udp))?$/.exec(text);
  if (!m)
    return null;
  const port = Number(m[1]);
  return port >= 1 && port <= 65535 ? port : null;
}
function parseEnv(raw, where, errors) {
  const out = {};
  if (raw === undefined)
    return out;
  const assign = (entry) => {
    if (typeof entry !== "string") {
      errors.push(`${where}: environment entries must be "KEY=value" strings`);
      return;
    }
    const idx = entry.indexOf("=");
    if (idx <= 0) {
      errors.push(`${where}: environment entry ${JSON.stringify(entry)} needs KEY=value`);
      return;
    }
    out[entry.slice(0, idx)] = entry.slice(idx + 1);
  };
  if (Array.isArray(raw)) {
    for (const entry of raw)
      assign(entry);
    return out;
  }
  if (typeof raw === "object" && raw !== null) {
    for (const [k, v] of Object.entries(raw)) {
      out[k] = v === null || v === undefined ? "" : String(v);
    }
    return out;
  }
  errors.push(`${where}: environment must be a list or a mapping`);
  return out;
}
function parseDependsOn(raw) {
  if (raw === undefined)
    return [];
  if (Array.isArray(raw))
    return raw.map((s) => String(s));
  if (typeof raw === "object" && raw !== null)
    return Object.keys(raw);
  return [String(raw)];
}
function checkVolumeTarget(volume, where, errors) {
  const source = volume.split(":")[0] ?? "";
  if (source.startsWith("/") || source.startsWith(".") || source.startsWith("~") || source === "") {
    errors.push(`${where}: volume ${JSON.stringify(volume)} mounts a host path — named volumes only (e.g. "data:/var/lib/app")`);
  }
}
function imageTag(image) {
  const lastSlash = image.lastIndexOf("/");
  const lastColon = image.lastIndexOf(":");
  if (lastColon > lastSlash)
    return image.slice(lastColon + 1);
  return null;
}
function parseCompose(yamlText) {
  const errors = [];
  let doc;
  try {
    doc = import_yaml.parse(yamlText);
  } catch (err) {
    return {
      services: [],
      volumes: [],
      errors: [`compose.yml: invalid YAML (${err.message})`]
    };
  }
  if (typeof doc !== "object" || doc === null) {
    return {
      services: [],
      volumes: [],
      errors: ["compose.yml: top level must be a mapping with services:"]
    };
  }
  const root = doc;
  const rawServices = root["services"];
  if (typeof rawServices !== "object" || rawServices === null || Array.isArray(rawServices)) {
    return {
      services: [],
      volumes: [],
      errors: ["compose.yml: services: must be a mapping"]
    };
  }
  const topVolumes = typeof root["volumes"] === "object" && root["volumes"] !== null ? Object.keys(root["volumes"]) : [];
  const services = [];
  for (const [name, raw] of Object.entries(rawServices)) {
    const where = `compose.yml services.${name}`;
    if (!/^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$/.test(name)) {
      errors.push(`${where}: service name must be lowercase alphanumeric with dashes`);
      continue;
    }
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      errors.push(`${where}: service must be a mapping`);
      continue;
    }
    const svc = raw;
    for (const key of FORBIDDEN_SERVICE_KEYS) {
      if (svc[key] !== undefined) {
        errors.push(`${where}: "${key}" is forbidden in blueprints` + (key === "ports" ? " — declare routes in blueprint.toml, the edge publishes them" : key === "networks" || key === "network_mode" ? " — services share the project network automatically" : key === "build" ? " — use a direct kraft.json blueprint for built images" : ""));
      }
    }
    const image = svc["image"];
    if (typeof image !== "string" || image.length === 0) {
      errors.push(`${where}: image: is required (a pinned upstream image)`);
      continue;
    }
    const tag = imageTag(image);
    const unpinned = tag === null || tag === "latest";
    const expose = [];
    const rawExpose = svc["expose"];
    if (rawExpose !== undefined) {
      const list = Array.isArray(rawExpose) ? rawExpose : [rawExpose];
      for (const entry of list) {
        const port = parseExposePort(entry);
        if (port === null)
          errors.push(`${where}: expose entry ${JSON.stringify(entry)} is not a plain port`);
        else if (!expose.includes(port))
          expose.push(port);
      }
    }
    const environment = parseEnv(svc["environment"], where, errors);
    const volumes = [];
    const rawVolumes = svc["volumes"];
    if (rawVolumes !== undefined) {
      if (!Array.isArray(rawVolumes)) {
        errors.push(`${where}: volumes must be a list of "name:/container/path"`);
      } else {
        for (const v of rawVolumes) {
          if (typeof v !== "string") {
            errors.push(`${where}: long-syntax volumes are not supported — use "name:/container/path"`);
            continue;
          }
          checkVolumeTarget(v, where, errors);
          volumes.push(v);
        }
      }
    }
    const restartRaw = svc["restart"];
    let restart;
    if (restartRaw !== undefined) {
      if (typeof restartRaw !== "string" || !ALLOWED_RESTART.has(restartRaw)) {
        errors.push(`${where}: restart must be one of no|always|on-failure|unless-stopped`);
      } else {
        restart = restartRaw;
      }
    }
    const commandRaw = svc["command"];
    if (commandRaw !== undefined && typeof commandRaw !== "string") {
      errors.push(`${where}: command must be a shell string (exact argv stays kraft.json-only)`);
    }
    services.push({
      name,
      image,
      expose,
      environment,
      volumes,
      dependsOn: parseDependsOn(svc["depends_on"]),
      restart,
      healthcheck: svc["healthcheck"] ?? undefined,
      command: typeof commandRaw === "string" ? commandRaw : undefined,
      unpinned
    });
  }
  if (services.length === 0 && errors.length === 0) {
    errors.push("compose.yml: at least one service is required");
  }
  return { services, volumes: topVolumes, errors };
}
function checkComposeRefs(services, declaredVars) {
  const errors = [];
  const usedBy = {};
  for (const svc of services) {
    for (const value of Object.values(svc.environment)) {
      for (const expr of extractRefs(value)) {
        const ref = parseRef(expr);
        if (ref.kind === "invalid") {
          errors.push(`compose.yml services.${svc.name}: unknown expression \${${expr}} — reference a [variables] entry`);
        } else if (ref.kind === "advanced") {
          errors.push(`compose.yml services.${svc.name}: \${${expr}} is not supported here — reference a [variables] entry`);
        } else if (ref.kind === "helper") {
          errors.push(`compose.yml services.${svc.name}: \${${expr}} helpers belong in blueprint.toml [variables], not in compose values`);
        } else if (!declaredVars.has(ref.name)) {
          errors.push(`compose.yml services.${svc.name}: variable "${ref.name}" is not declared in [variables]`);
        } else {
          const list = usedBy[ref.name] ?? [];
          if (!list.includes(svc.name))
            list.push(svc.name);
          usedBy[ref.name] = list;
        }
      }
    }
  }
  return { usedBy, errors };
}

// node_modules/smol-toml/dist/date.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i;

class TomlDate extends Date {
  #hasDate = false;
  #hasTime = false;
  #offset = null;
  constructor(date) {
    let hasDate = true;
    let hasTime = true;
    let offset = "Z";
    if (typeof date === "string") {
      let match = date.match(DATE_TIME_RE);
      if (match) {
        if (!match[1]) {
          hasDate = false;
          date = `0000-01-01T${date}`;
        }
        hasTime = !!match[2];
        hasTime && date[10] === " " && (date = date.replace(" ", "T"));
        if (match[2] && +match[2] > 23) {
          date = "";
        } else {
          offset = match[3] || null;
          date = date.toUpperCase();
          if (!offset && hasTime)
            date += "Z";
        }
      } else {
        date = "";
      }
    }
    super(date);
    if (!isNaN(this.getTime())) {
      this.#hasDate = hasDate;
      this.#hasTime = hasTime;
      this.#offset = offset;
    }
  }
  isDateTime() {
    return this.#hasDate && this.#hasTime;
  }
  isLocal() {
    return !this.#hasDate || !this.#hasTime || !this.#offset;
  }
  isDate() {
    return this.#hasDate && !this.#hasTime;
  }
  isTime() {
    return this.#hasTime && !this.#hasDate;
  }
  isValid() {
    return this.#hasDate || this.#hasTime;
  }
  toISOString() {
    let iso = super.toISOString();
    if (this.isDate())
      return iso.slice(0, 10);
    if (this.isTime())
      return iso.slice(11, 23);
    if (this.#offset === null)
      return iso.slice(0, -1);
    if (this.#offset === "Z")
      return iso;
    let offset = +this.#offset.slice(1, 3) * 60 + +this.#offset.slice(4, 6);
    offset = this.#offset[0] === "-" ? offset : -offset;
    let offsetDate = new Date(this.getTime() - offset * 60000);
    return offsetDate.toISOString().slice(0, -1) + this.#offset;
  }
  static wrapAsOffsetDateTime(jsDate, offset = "Z") {
    let date = new TomlDate(jsDate);
    date.#offset = offset;
    return date;
  }
  static wrapAsLocalDateTime(jsDate) {
    let date = new TomlDate(jsDate);
    date.#offset = null;
    return date;
  }
  static wrapAsLocalDate(jsDate) {
    let date = new TomlDate(jsDate);
    date.#hasTime = false;
    date.#offset = null;
    return date;
  }
  static wrapAsLocalTime(jsDate) {
    let date = new TomlDate(jsDate);
    date.#hasDate = false;
    date.#offset = null;
    return date;
  }
}

// node_modules/smol-toml/dist/error.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function getLineColFromPtr(string, ptr) {
  let lines = string.slice(0, ptr).split(/\r\n|\n|\r/g);
  return [lines.length, lines.pop().length + 1];
}
function makeCodeBlock(string, line, column) {
  let lines = string.split(/\r\n|\n|\r/g);
  let codeblock = "";
  let numberLen = (Math.log10(line + 1) | 0) + 1;
  for (let i = line - 1;i <= line + 1; i++) {
    let l = lines[i - 1];
    if (!l)
      continue;
    codeblock += i.toString().padEnd(numberLen, " ");
    codeblock += ":  ";
    codeblock += l;
    codeblock += `
`;
    if (i === line) {
      codeblock += " ".repeat(numberLen + column + 2);
      codeblock += `^
`;
    }
  }
  return codeblock;
}

class TomlError extends Error {
  line;
  column;
  codeblock;
  constructor(message, options) {
    const [line, column] = getLineColFromPtr(options.toml, options.ptr);
    const codeblock = makeCodeBlock(options.toml, line, column);
    super(`Invalid TOML document: ${message}

${codeblock}`, options);
    this.line = line;
    this.column = column;
    this.codeblock = codeblock;
  }
}

// node_modules/smol-toml/dist/util.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function indexOfNewline(str, start = 0) {
  let idx = str.indexOf(`
`, start);
  if (str.charCodeAt(idx - 1) === 13)
    idx--;
  return idx;
}
function skipComment(ctx) {
  for (;ctx.p < ctx.s.length; ctx.p++) {
    let c = ctx.s.charCodeAt(ctx.p);
    if (c === 10)
      break;
    if (c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10) {
      ctx.p++;
      break;
    }
    if (c < 32 && c !== 9 || c === 127) {
      throw new TomlError("control characters are not allowed in comments", {
        toml: ctx.s,
        ptr: ctx.p
      });
    }
  }
}
function skipVoid(ctx, banNewLines, banComments) {
  let c;
  while (true) {
    while ((c = ctx.s.charCodeAt(ctx.p)) === 32 || c === 9 || !banNewLines && (c === 10 || c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10))
      ctx.p++;
    if (banComments || c !== 35)
      break;
    skipComment(ctx);
  }
}
function skipUntil(ctx, sep, end) {
  let ptr = ctx.p;
  if (!end) {
    ptr = indexOfNewline(ctx.s, ptr);
    ctx.p = ptr < 0 ? ctx.s.length : ptr;
    return;
  }
  for (;ctx.p < ctx.s.length; ctx.p++) {
    let c = ctx.s.charCodeAt(ctx.p);
    if (c === 35) {
      skipComment(ctx);
    } else if (c === end || c === sep) {
      return;
    }
  }
  throw new TomlError("cannot find end of structure", {
    toml: ctx.s,
    ptr
  });
}

// node_modules/smol-toml/dist/primitive.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var INT_REGEX = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
var FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
var LEADING_ZERO = /^[+-]?0[0-9_]/;
function parseString(ctx) {
  let start = ctx.p;
  let c = ctx.s.charCodeAt(ctx.p++);
  let first = c;
  let isLiteral = c === 39;
  let isMultiline = c === ctx.s.charCodeAt(ctx.p) && c === ctx.s.charCodeAt(ctx.p + 1);
  if (isMultiline) {
    if ((c = ctx.s.charCodeAt(ctx.p += 2)) === 10)
      ctx.p++;
    else if (c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10)
      ctx.p += 2;
  }
  let parsed = "";
  let sliceStart = ctx.p;
  let state = 0;
  for (;ctx.p < ctx.s.length; ctx.p++) {
    c = ctx.s.charCodeAt(ctx.p);
    if (isMultiline && (c === 10 || c === 13 && ctx.s.charCodeAt(ctx.p + 1) === 10)) {
      state = state && 3;
    } else if (c < 32 && c !== 9 || c === 127) {
      throw new TomlError("control characters are not allowed in strings", {
        toml: ctx.s,
        ptr: ctx.p
      });
    } else if ((!state || state === 3) && c === first && (!isMultiline || ctx.s.charCodeAt(ctx.p + 1) === first && ctx.s.charCodeAt(ctx.p + 2) === first)) {
      if (isMultiline) {
        if (ctx.s.charCodeAt(ctx.p + 3) === first)
          ctx.p++;
        if (ctx.s.charCodeAt(ctx.p + 3) === first)
          ctx.p++;
      }
      if (!state)
        parsed += ctx.s.slice(sliceStart, ctx.p);
      ctx.p += isMultiline ? 3 : 1;
      return parsed;
    } else if (!state) {
      if (!isLiteral && c === 92) {
        parsed += ctx.s.slice(sliceStart, sliceStart = ctx.p);
        state = 1;
      }
    } else if (state === 1) {
      if (c === 120 || c === 117 || c === 85) {
        let value = 0;
        let len = c === 120 ? 2 : c === 117 ? 4 : 8;
        for (let j = 0;j < len; j++, ctx.p++) {
          let hex = ctx.s.charCodeAt(ctx.p + 1);
          let digit = hex >= 48 && hex <= 57 ? hex - 48 : hex >= 65 && hex <= 70 ? hex - 65 + 10 : hex >= 97 && hex <= 102 ? hex - 97 + 10 : -1;
          if (digit < 0)
            throw new TomlError("invalid non-hex character in unicode escape", { toml: ctx.s, ptr: ctx.p + 1 });
          value = value << 4 | digit;
        }
        if (value < 0 || value > 1114111 || value >= 55296 && value <= 57343) {
          throw new TomlError("invalid unicode escape", { toml: ctx.s, ptr: ctx.p });
        }
        parsed += String.fromCodePoint(value);
        sliceStart = ctx.p + 1;
        state = 0;
      } else if (c === 32 || c === 9) {
        state = 2;
      } else {
        if (c === 98)
          parsed += "\b";
        else if (c === 116)
          parsed += "\t";
        else if (c === 110)
          parsed += `
`;
        else if (c === 102)
          parsed += "\f";
        else if (c === 114)
          parsed += "\r";
        else if (c === 101)
          parsed += "\x1B";
        else if (c === 34)
          parsed += '"';
        else if (c === 92)
          parsed += "\\";
        else
          throw new TomlError("unrecognized escape sequence", { toml: ctx.s, ptr: ctx.p });
        sliceStart = ctx.p + 1;
        state = 0;
      }
    } else if (c !== 32 && c !== 9) {
      if (state === 2) {
        throw new TomlError("invalid escape: only line-ending whitespace may be escaped", {
          toml: ctx.s,
          ptr: sliceStart
        });
      }
      state = !isLiteral && c === 92 ? 1 : 0;
      sliceStart = ctx.p;
    }
  }
  throw new TomlError("unfinished string", { toml: ctx.s, ptr: start });
}
function sliceAndTrimEndOf(ctx, start, end) {
  let value = ctx.s.slice(start, end);
  let commentIdx = value.indexOf("#");
  if (commentIdx > 0) {
    skipComment({ s: value, p: commentIdx, d: 0 });
    value = value.slice(0, commentIdx);
  }
  return value.trimEnd();
}
function parseValue(ctx, integersAsBigInt, end) {
  let ptr = ctx.p;
  let err = { toml: ctx.s, ptr };
  skipUntil(ctx, 44, end);
  let value = sliceAndTrimEndOf(ctx, ptr, ctx.p);
  if (!value)
    throw new TomlError("incomplete declaration: value expected", err);
  if (value === "-inf")
    return -Infinity;
  if (value === "inf" || value === "+inf")
    return Infinity;
  if (value === "nan" || value === "+nan" || value === "-nan")
    return NaN;
  if (value === "-0")
    return integersAsBigInt ? 0n : 0;
  let isInt = INT_REGEX.test(value);
  if (isInt || FLOAT_REGEX.test(value)) {
    if (LEADING_ZERO.test(value)) {
      throw new TomlError("leading zeroes are not allowed", err);
    }
    value = value.replace(/_/g, "");
    let numeric = +value;
    if (isNaN(numeric)) {
      throw new TomlError("invalid number", err);
    }
    if (isInt) {
      if ((isInt = !Number.isSafeInteger(numeric)) && !integersAsBigInt) {
        throw new TomlError("integer value cannot be represented losslessly", err);
      }
      if (isInt || integersAsBigInt === true)
        numeric = BigInt(value);
    }
    return numeric;
  }
  const date = new TomlDate(value);
  if (!date.isValid())
    throw new TomlError("invalid value", err);
  return date;
}

// node_modules/smol-toml/dist/extract.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function extractValue(ctx, end, integersAsBigInt) {
  let ptr = ctx.p;
  let c = ctx.s.charCodeAt(ptr);
  if (c === 91 || c === 123) {
    if (!ctx.d--) {
      throw new TomlError("document contains excessively nested structures. aborting.", {
        toml: ctx.s,
        ptr
      });
    }
    let value = c === 91 ? parseArray(ctx, integersAsBigInt) : parseInlineTable(ctx, integersAsBigInt);
    ctx.d++;
    return value;
  }
  if (c === 34 || c === 39) {
    return parseString(ctx);
  }
  if (c === 116) {
    if (ctx.s.charCodeAt(++ctx.p) !== 114 || ctx.s.charCodeAt(++ctx.p) !== 117 || ctx.s.charCodeAt(++ctx.p) !== 101)
      throw new TomlError("invalid value", { toml: ctx.s, ptr });
    ctx.p++;
    return true;
  }
  if (c === 102) {
    if (ctx.s.charCodeAt(++ctx.p) !== 97 || ctx.s.charCodeAt(++ctx.p) !== 108 || ctx.s.charCodeAt(++ctx.p) !== 115 || ctx.s.charCodeAt(++ctx.p) !== 101)
      throw new TomlError("invalid value", { toml: ctx.s, ptr });
    ctx.p++;
    return false;
  }
  return parseValue(ctx, integersAsBigInt, end);
}

// node_modules/smol-toml/dist/struct.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
function parseKey(ctx, end = "=") {
  let start = ctx.p;
  let dot = start - 1;
  let parsed = [];
  let endPtr = ctx.s.indexOf(end, start);
  if (endPtr < 0) {
    throw new TomlError("incomplete key-value: cannot find end of key", {
      toml: ctx.s,
      ptr: start
    });
  }
  do {
    let c = ctx.s.charCodeAt(ctx.p = ++dot);
    if (c !== 32 && c !== 9) {
      if (c === 34 || c === 39) {
        if (c === ctx.s.charCodeAt(ctx.p + 1) && c === ctx.s.charCodeAt(ctx.p + 2)) {
          throw new TomlError("multiline strings are not allowed in keys", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        let part = parseString(ctx);
        dot = ctx.s.indexOf(".", ctx.p);
        let strEnd = ctx.s.slice(ctx.p, dot < 0 || dot > endPtr ? endPtr : dot);
        let newLine = indexOfNewline(strEnd);
        if (newLine > -1) {
          throw new TomlError("newlines are not allowed in keys", {
            toml: ctx.s,
            ptr: newLine
          });
        }
        if (strEnd.trimStart()) {
          throw new TomlError("found extra tokens after the string part", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        if (endPtr < ctx.p) {
          endPtr = ctx.s.indexOf(end, ctx.p);
          if (endPtr < 0) {
            throw new TomlError("incomplete key-value: cannot find end of key", {
              toml: ctx.s,
              ptr: start
            });
          }
        }
        parsed.push(part);
      } else {
        dot = ctx.s.indexOf(".", ctx.p);
        let part = ctx.s.slice(ctx.p, dot < 0 || dot > endPtr ? endPtr : dot);
        if (!KEY_PART_RE.test(part)) {
          throw new TomlError("only letter, numbers, dashes and underscores are allowed in keys", {
            toml: ctx.s,
            ptr: ctx.p
          });
        }
        parsed.push(part.trimEnd());
      }
    }
  } while (dot + 1 && dot < endPtr);
  ctx.p = endPtr + 1;
  skipVoid(ctx, true, true);
  return parsed;
}
function parseInlineTable(ctx, integersAsBigInt) {
  let res = {};
  let seen = new Set;
  let c;
  ctx.p++;
  while (ctx.p < ctx.s.length) {
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p)) === 125) {
      ctx.p++;
      return res;
    }
    let k;
    let t = res;
    let hasOwn = false;
    let p = ctx.p;
    let key = parseKey(ctx);
    for (let i = 0;i < key.length; i++) {
      if (i)
        t = hasOwn ? t[k] : t[k] = {};
      k = key[i];
      if ((hasOwn = Object.hasOwn(t, k)) && (typeof t[k] !== "object" || seen.has(t[k]))) {
        throw new TomlError("trying to redefine an already defined value", {
          toml: ctx.s,
          ptr: p
        });
      }
      if (!hasOwn && k === "__proto__") {
        Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
      }
    }
    if (hasOwn) {
      throw new TomlError("trying to redefine an already defined value", {
        toml: ctx.s,
        ptr: ctx.p
      });
    }
    let value = extractValue(ctx, 125, integersAsBigInt);
    seen.add(t[k] = value);
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p++)) === 125) {
      return res;
    }
    if (c !== 44) {
      throw new TomlError("expected comma or end of structure", { toml: ctx.s, ptr: ctx.p - 1 });
    }
  }
  throw new TomlError("unfinished table encountered", {
    toml: ctx.s,
    ptr: ctx.p
  });
}
function parseArray(ctx, integersAsBigInt) {
  let res = [];
  let c;
  ctx.p++;
  while (ctx.p < ctx.s.length) {
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p)) === 93) {
      ctx.p++;
      return res;
    }
    res.push(extractValue(ctx, 93, integersAsBigInt));
    skipVoid(ctx);
    if ((c = ctx.s.charCodeAt(ctx.p++)) === 93) {
      return res;
    }
    if (c !== 44) {
      throw new TomlError("expected comma or end of structure", { toml: ctx.s, ptr: ctx.p - 1 });
    }
  }
  throw new TomlError("unfinished array encountered", {
    toml: ctx.s,
    ptr: ctx.p
  });
}

// node_modules/smol-toml/dist/parse.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function peekTable(key, table, meta, type) {
  let t = table;
  let m = meta;
  let k;
  let hasOwn = false;
  let state;
  for (let i = 0;i < key.length; i++) {
    if (i) {
      t = hasOwn ? t[k] : t[k] = {};
      m = (state = m[k]).c;
      if (type === 0 && (state.t === 1 || state.t === 2)) {
        return null;
      }
      if (state.t === 2) {
        let l = t.length - 1;
        t = t[l];
        m = m[l].c;
      }
    }
    k = key[i];
    if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 && m[k]?.d) {
      return null;
    }
    if (!hasOwn) {
      if (k === "__proto__") {
        Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
        Object.defineProperty(m, k, { enumerable: true, configurable: true, writable: true });
      }
      m[k] = {
        t: i < key.length - 1 && type === 2 ? 3 : type,
        d: false,
        i: 0,
        c: {}
      };
    }
  }
  state = m[k];
  if (state.t !== type && !(type === 1 && state.t === 3)) {
    return null;
  }
  if (type === 2) {
    if (!state.d) {
      state.d = true;
      t[k] = [];
    }
    t[k].push(t = {});
    state.c[state.i++] = state = { t: 1, d: false, i: 0, c: {} };
  }
  if (state.d) {
    return null;
  }
  state.d = true;
  if (type === 1) {
    t = hasOwn ? t[k] : t[k] = {};
  } else if (type === 0 && hasOwn) {
    return null;
  }
  return [k, t, state.c];
}
function parse4(toml, { maxDepth = 1000, integersAsBigInt } = {}) {
  let ctx = { s: toml, p: 0, d: maxDepth };
  let res = {};
  let meta = {};
  let tmp;
  let tbl = res;
  let m = meta;
  skipVoid(ctx);
  while (ctx.p < toml.length) {
    if (toml.charCodeAt(ctx.p) === 91) {
      let isTableArray = toml.charCodeAt(++ctx.p) === 91;
      tmp = ctx.p += +isTableArray;
      let k = parseKey(ctx, "]");
      if (isTableArray) {
        if (toml.charCodeAt(ctx.p - 1) !== 93) {
          throw new TomlError("expected end of table declaration", {
            toml,
            ptr: ctx.p - 1
          });
        }
        ctx.p++;
      }
      let p = peekTable(k, res, meta, isTableArray ? 2 : 1);
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr: tmp
        });
      }
      m = p[2];
      tbl = p[1];
    } else {
      tmp = ctx.p;
      let k = parseKey(ctx);
      let p = peekTable(k, tbl, m, 0);
      if (!p) {
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr: tmp
        });
      }
      p[1][p[0]] = extractValue(ctx, undefined, integersAsBigInt);
    }
    skipVoid(ctx, true);
    if (ctx.p < toml.length && (tmp = toml.charCodeAt(ctx.p)) !== 10 && tmp !== 13) {
      throw new TomlError("each key-value declaration must be followed by an end-of-line", {
        toml,
        ptr: ctx.p
      });
    }
    skipVoid(ctx);
  }
  return res;
}

// node_modules/smol-toml/dist/stringify.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// node_modules/smol-toml/dist/index.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// packages/core/src/apps/blueprint/blueprint-toml.ts
var ROUTE_MODES = new Set(["domain", "port", "publish", "internal"]);
var DENIED_FILE_PREFIXES = [
  "/proc",
  "/sys",
  "/etc/passwd",
  "/etc/shadow",
  "/var/run"
];
function isRecord(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function parseBlueprintToml(text) {
  const errors = [];
  let doc;
  try {
    doc = parse4(text);
  } catch (err) {
    return {
      variables: {},
      routes: [],
      env: {},
      files: [],
      errors: [`blueprint.toml: invalid TOML (${err.message})`]
    };
  }
  if (!isRecord(doc)) {
    return {
      variables: {},
      routes: [],
      env: {},
      files: [],
      errors: ["blueprint.toml: top level must be a table"]
    };
  }
  const variables = {};
  const rawVars = doc["variables"];
  if (rawVars !== undefined) {
    if (!isRecord(rawVars)) {
      errors.push("blueprint.toml: [variables] must be a table of KEY = expression");
    } else {
      for (const [k, v] of Object.entries(rawVars)) {
        if (typeof v !== "string") {
          errors.push(`blueprint.toml variables.${k}: value must be a string`);
          continue;
        }
        variables[k] = v;
      }
    }
  }
  const routes = [];
  const rawRoutes = doc["routes"];
  if (rawRoutes !== undefined) {
    const list = Array.isArray(rawRoutes) ? rawRoutes : [rawRoutes];
    list.forEach((r, i) => {
      const where = `blueprint.toml routes[${i}]`;
      if (!isRecord(r)) {
        errors.push(`${where}: must be a table`);
        return;
      }
      const service = r["service"];
      const port = r["port"];
      if (typeof service !== "string" || service.length === 0) {
        errors.push(`${where}: service is required`);
        return;
      }
      if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535) {
        errors.push(`${where}: port must be an integer 1-65535`);
        return;
      }
      const kind = r["kind"];
      if (kind !== undefined && kind !== "http" && kind !== "tcp") {
        errors.push(`${where}: kind must be "http" or "tcp"`);
        return;
      }
      const mode = r["mode"];
      if (mode !== undefined && (typeof mode !== "string" || !ROUTE_MODES.has(mode))) {
        errors.push(`${where}: mode must be one of domain|port|publish|internal`);
        return;
      }
      const host = r["host"];
      if (host !== undefined && typeof host !== "string") {
        errors.push(`${where}: host must be a string`);
        return;
      }
      if (r["path"] !== undefined) {
        errors.push(`${where}: path is reserved and not routed yet — omit it`);
      }
      routes.push({
        service,
        port,
        host: typeof host === "string" ? host : undefined,
        kind: kind === "tcp" ? "tcp" : "http",
        label: typeof r["label"] === "string" ? r["label"] : undefined,
        mode: mode ?? undefined
      });
    });
  }
  const env = {};
  const rawEnv = doc["env"];
  const rawConfig = doc["config"];
  if (rawEnv !== undefined && rawConfig !== undefined) {
    errors.push("blueprint.toml: use [env], not both [env] and [config]");
  }
  const envTable = rawEnv ?? rawConfig;
  if (envTable !== undefined) {
    if (!isRecord(envTable)) {
      errors.push("blueprint.toml: [env] must be a table of KEY = value");
    } else {
      for (const [k, v] of Object.entries(envTable)) {
        if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean") {
          errors.push(`blueprint.toml env.${k}: value must be a string, number or boolean`);
          continue;
        }
        env[k] = String(v);
      }
    }
  }
  const files = [];
  const rawFiles = doc["files"];
  if (rawFiles !== undefined) {
    const list = Array.isArray(rawFiles) ? rawFiles : [rawFiles];
    if (list.length > 20) {
      errors.push("blueprint.toml: at most 20 [[files]] entries per app");
    }
    list.forEach((f, i) => {
      const where = `blueprint.toml files[${i}]`;
      if (!isRecord(f)) {
        errors.push(`${where}: must be a table`);
        return;
      }
      const service = f["service"];
      const path = f["path"];
      const content = f["content"];
      if (typeof service !== "string" || service.length === 0) {
        errors.push(`${where}: service is required`);
        return;
      }
      if (typeof path !== "string" || !path.startsWith("/") || path.includes("..")) {
        errors.push(`${where}: path must be absolute without ".."`);
        return;
      }
      if (DENIED_FILE_PREFIXES.some((p) => path === p || path.startsWith(p + "/"))) {
        errors.push(`${where}: path ${JSON.stringify(path)} is not writable by blueprints`);
        return;
      }
      if (typeof content !== "string") {
        errors.push(`${where}: content must be a string`);
        return;
      }
      if (content.length > 256 * 1024) {
        errors.push(`${where}: content exceeds 256 KiB`);
        return;
      }
      files.push({ service, path, content });
    });
  }
  return { variables, routes, env, files, errors };
}
function checkTomlRefs(toml, declaredVars) {
  const errors = [];
  const usedBy = {};
  const note = (varName, owner) => {
    const list = usedBy[varName] ?? [];
    if (!list.includes(owner))
      list.push(owner);
    usedBy[varName] = list;
  };
  const scan = (value, where, owner) => {
    for (const expr of extractRefs(value)) {
      const ref = parseRef(expr);
      if (ref.kind === "invalid") {
        errors.push(`${where}: unknown expression \${${expr}}`);
      } else if (ref.kind === "advanced") {
        errors.push(`${where}: \${${expr}} is not supported in the simplified format — use a direct kraft.json blueprint`);
      } else if (ref.kind === "helper") {
        errors.push(`${where}: \${${expr}} must be declared in [variables] and referenced by name`);
      } else if (!declaredVars.has(ref.name)) {
        errors.push(`${where}: variable "${ref.name}" is not declared in [variables]`);
      } else {
        note(ref.name, owner);
      }
    }
  };
  toml.routes.forEach((r, i) => {
    if (r.host !== undefined)
      scan(r.host, `blueprint.toml routes[${i}].host`, r.service);
  });
  for (const [k, v] of Object.entries(toml.env)) {
    scan(v, `blueprint.toml env.${k}`, "__env__");
  }
  toml.files.forEach((f, i) => {
    scan(f.content, `blueprint.toml files[${i}].content`, f.service);
  });
  return { usedBy, errors };
}
// packages/core/src/apps/blueprint/migrate.ts
var import_yaml2 = __toESM(require_dist(), 1);

// packages/core/src/apps/blueprint/index.ts
function convertBlueprint(files) {
  const warnings = [];
  const hasSimplified = files.composeYaml !== undefined || files.tomlText !== undefined;
  const hasDirect = files.kraftJsonText !== undefined;
  if (hasSimplified && hasDirect) {
    return {
      ok: false,
      errors: [
        `blueprints/${files.dirId}: use compose.yml + blueprint.toml OR kraft.json, never both`
      ],
      warnings
    };
  }
  if (hasDirect)
    return convertDirect(files);
  if (files.composeYaml === undefined || files.tomlText === undefined) {
    const missing = [
      files.composeYaml === undefined ? "compose.yml" : null,
      files.tomlText === undefined ? "blueprint.toml" : null
    ].filter(Boolean);
    return {
      ok: false,
      errors: [
        `blueprints/${files.dirId}: missing ${missing.join(" and ")} (or provide kraft.json instead)`
      ],
      warnings
    };
  }
  const { meta, errors: metaErrors } = parseMeta(files.metaText, files.dirId);
  const compose = parseCompose(files.composeYaml);
  const toml = parseBlueprintToml(files.tomlText);
  const errors = [...metaErrors, ...compose.errors, ...toml.errors];
  if (meta === null)
    return { ok: false, errors, warnings };
  const declaredVars = new Set(Object.keys(toml.variables));
  const composeRefs = checkComposeRefs(compose.services, declaredVars);
  const tomlRefs = checkTomlRefs(toml, declaredVars);
  errors.push(...composeRefs.errors, ...tomlRefs.errors);
  const referenced = new Set([
    ...Object.keys(composeRefs.usedBy),
    ...Object.keys(tomlRefs.usedBy)
  ]);
  for (const v of declaredVars) {
    if (!referenced.has(v)) {
      warnings.push(`blueprint.toml variables.${v}: declared but never used`);
    }
  }
  if (errors.length > 0)
    return { ok: false, errors, warnings };
  const usedBy = {};
  for (const [k, v] of Object.entries({
    ...composeRefs.usedBy,
    ...tomlRefs.usedBy
  })) {
    usedBy[k] = [...new Set([...usedBy[k] ?? [], ...v])];
  }
  const {
    template,
    warnings: convWarnings,
    errors: convErrors
  } = convertSimplified(meta, compose.services, toml, usedBy);
  warnings.push(...convWarnings);
  if (convErrors.length > 0)
    return { ok: false, errors: convErrors, warnings };
  const gate = parseAppTemplate(template);
  if (!gate.ok) {
    const detail = gate.detail;
    return {
      ok: false,
      errors: [
        `blueprints/${files.dirId}: converted template failed validation (${gate.reason}${detail ? `: ${detail}` : ""})`
      ],
      warnings
    };
  }
  return { ok: true, value: { template, warnings } };
}
function convertDirect(files) {
  const warnings = [];
  const { meta, errors: metaErrors } = parseMeta(files.metaText, files.dirId);
  if (meta === null)
    return { ok: false, errors: metaErrors, warnings };
  let raw;
  try {
    raw = JSON.parse(files.kraftJsonText);
  } catch (err) {
    return {
      ok: false,
      errors: [`kraft.json: invalid JSON (${err.message})`],
      warnings
    };
  }
  const template = raw;
  if (template.id !== files.dirId) {
    return {
      ok: false,
      errors: [
        `kraft.json: "id" must be "${files.dirId}" (got ${JSON.stringify(template.id)})`
      ],
      warnings
    };
  }
  const gate = parseAppTemplate(template);
  if (!gate.ok) {
    const detail = gate.detail;
    return {
      ok: false,
      errors: [
        `kraft.json: invalid template (${gate.reason}${detail ? `: ${detail}` : ""})`
      ],
      warnings
    };
  }
  if (template.name !== meta.name || template.description !== meta.description) {
    warnings.push("kraft.json name/description differ from meta.json — kraft.json wins at runtime");
  }
  return { ok: true, value: { template, warnings } };
}

// packages/core/src/apps/blueprint/compile.ts
function readIfExists(dir, file) {
  const path = import_node_path.join(dir, file);
  return import_node_fs.existsSync(path) ? import_node_fs.readFileSync(path, "utf8") : undefined;
}
function compileBlueprints(blueprintsDir) {
  const apps = [];
  const index = [];
  const failures = [];
  let dirs;
  try {
    dirs = import_node_fs.readdirSync(blueprintsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort((a, b) => a.localeCompare(b));
  } catch (err) {
    return {
      apps,
      index,
      failures: [
        {
          id: ".",
          errors: [`cannot read ${blueprintsDir}: ${err.message}`]
        }
      ]
    };
  }
  for (const id of dirs) {
    const dir = import_node_path.join(blueprintsDir, id);
    const metaText = readIfExists(dir, "meta.json");
    if (metaText === undefined) {
      failures.push({ id, errors: [`blueprints/${id}: missing meta.json`] });
      continue;
    }
    const result = convertBlueprint({
      dirId: id,
      metaText,
      composeYaml: readIfExists(dir, "compose.yml") ?? readIfExists(dir, "compose.yaml"),
      tomlText: readIfExists(dir, "blueprint.toml"),
      kraftJsonText: readIfExists(dir, "kraft.json")
    });
    if (!result.ok) {
      failures.push({ id, errors: [...result.errors] });
      continue;
    }
    apps.push(result.value.template);
    let version = "0.0.0";
    try {
      const meta = JSON.parse(metaText);
      if (typeof meta.version === "string" && meta.version.length > 0)
        version = meta.version;
    } catch {}
    const t = result.value.template;
    index.push({
      id: t.id,
      name: t.name,
      version,
      category: t.category,
      tags: [...t.tags ?? []],
      ...t.updatedAt ? { updatedAt: t.updatedAt } : {}
    });
  }
  return { apps, index, failures };
}
