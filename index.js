// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"tags/admin-field.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-field-text', '<div class="fs11 bold text-gray mb8" if="{opts.field.label}">{opts.field.label}</div> <input class="input w-full {&quot;bg-whitesmoke border-transparent&quot;: opts.field.options.readonly}" ref="input" type="text" riot-value="{opts.riotValue.toString()}" required="{opts.field.options.required}" readonly="{opts.field.options.readonly}">', 'admin-field-text,[data-is="admin-field-text"]{display:block}', '', function (opts) {
  this.getValue = () => {
    var value = this.refs.input.value;

    if (Array.isArray(this.opts.riotValue)) {
      return value.split(',').map(s => s.trim());
    } else {
      return value;
    }
  };
});
riot.tag2('admin-field-textarea', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div> <div class="border-top border-right border-left p8" if="{opts.field.options.shortcode}"> <button class="px8 py6 button mr4" type="button" each="{shortcode in app.admin.shortcodes.list}" onclick="{onInsertText}">{shortcode.label}</button> </div> <textarea class="input w-full lh15 {&quot;bg-whitesmoke border-transparent&quot;: opts.field.options.readonly}" ref="input" rows="{opts.field.rows || 4}" readonly="{opts.field.options.readonly}">{opts.riotValue}</textarea> </div>', 'admin-field-textarea,[data-is="admin-field-textarea"]{display:block}', '', function (opts) {
  this.on('mount', () => {
    this.refs.input.ondragover = e => {
      return false;
    };

    this.refs.input.ondrop = async e => {
      e.preventDefault();
      var i = spat.modal.indicator();
      var files = Array.from(e.dataTransfer.files);
      var promises = files.map(async file => {
        let url = await app.admin.utils.uploadFile(file);
        url += '?auto=format';
        return url;
      });
      var urls = await Promise.all(promises);
      var images_text = urls.map(url => `![](${url})`).join('\n');
      this.insertText(images_text);
      i.close();
    };
  });

  this.onInsertText = async e => {
    var shortcode = e.item.shortcode;
    var onclick = shortcode.onclick;
    var text = '';

    if (onclick) {
      if (typeof onclick === 'string') {
        onclick = app.admin.shortcodes[onclick];
      }

      text = await onclick();
    } else {
      var input = this.refs.input;
      input.focus();
      var selectedValue = input.value.substring(input.selectionStart, input.selectionEnd);
      text = shortcode.prefix + selectedValue + shortcode.postfix;
    }

    if (text) {
      this.insertText(text);
    }
  };

  this.insertText = text => {
    let input = this.refs.input;
    let cursorPosition = input.selectionStart;
    let before = input.value.substr(0, cursorPosition);
    let after = input.value.substr(input.selectionEnd);
    input.value = before + text + after;
    input.selectionStart = input.selectionEnd = cursorPosition + text.length;
  };

  this.getValue = () => {
    return this.refs.input.value;
  };
});
riot.tag2('admin-field-number', '<div class="fs11 bold text-gray mb8" if="{opts.field.label}">{opts.field.label}</div> <input class="input w-full {&quot;bg-whitesmoke border-transparent&quot;: opts.field.options.readonly}" ref="input" step="{opts.field.options.step}" min="{opts.field.options.min}" max="{opts.field.options.max}" riot-value="{opts.riotValue}" required="{opts.field.options.required}" readonly="{opts.field.options.readonly}" type="{\'number\'}">', 'admin-field-number,[data-is="admin-field-number"]{display:block}', '', function (opts) {
  this.getValue = () => {
    return Number(this.refs.input.value);
  };
});
riot.tag2('admin-field-date', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <input class="input w-full {&quot;bg-whitesmoke border-transparent pointer-none&quot;: opts.field.options.readonly}" ref="datetimepicker" required="{opts.field.options.required}" placeholder="{opts.field.options.placeholder}" readonly="{opts.field.options.readonly}" tabindex="{opts.field.options.readonly ? -1 : 0}">', 'admin-field-date,[data-is="admin-field-date"]{display:block}', '', function (opts) {
  this.on('mount', () => {
    $(this.refs.datetimepicker).datetimepicker({});

    if (this.opts.riotValue) {
      var format = opts.field.options && opts.field.options.format || 'YYYY/MM/DD HH:mm';
      this.refs.datetimepicker.value = dayjs(this.opts.riotValue).format(format);
    }

    this.update();
  });

  this.getValue = () => {
    var datetime = dayjs(this.refs.datetimepicker.value.valueOf());
    return +datetime || 0;
  };
});
riot.tag2('admin-field-markdown', '<div>markdown</div>', 'admin-field-markdown,[data-is="admin-field-markdown"]{display:block}', '', function (opts) {});
riot.tag2('admin-field-select', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <select class="select px16 py12 pr40" ref="input" required="{opts.field.options.required}"> <option each="{choice in choices}" riot-value="{choice.value}">{choice.label || choice.value}</option> </select>', 'admin-field-select,[data-is="admin-field-select"]{display:block}', '', function (opts) {
  this.on('mount', async () => {
    var choices = opts.field.options.choices;

    if (typeof choices === 'function') {
      choices = choices();

      if (choices instanceof Promise) {
        choices = await choices;
      }
    }

    this.update({
      choices
    });
    this.refs.input.value = this.opts.riotValue;
  });

  this.getValue = () => {
    return this.refs.input.value;
  };
});
riot.tag2('admin-field-switch', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div class="relative switch cursor-pointer s-full rounded-full transition f fm border {&quot;bg-primary checked&quot;: checked}" onclick="{toggle}"> <div class="inner-button flex-fixed relative ml3"></div> </div>', 'admin-field-switch,[data-is="admin-field-switch"]{display:block} admin-field-switch .switch,[data-is="admin-field-switch"] .switch{width:50px;height:27px;cursor:pointer;-webkit-user-select:none;user-select:none;border-width:1px} admin-field-switch .switch.checked .inner-button,[data-is="admin-field-switch"] .switch.checked .inner-button{transform:translateX(23px)} admin-field-switch .inner-button,[data-is="admin-field-switch"] .inner-button{width:20px;height:20px;transform:translateX(-1px);background-color:lightgray;border-radius:50%;transition:256ms}', '', function (opts) {
  this.on('mount', () => {
    this.checked = this.opts.riotValue;
    this.update();
  });

  this.getValue = () => {
    return this.checked;
  };

  this.toggle = e => {
    this.checked = !this.checked;
  };
});
riot.tag2('admin-field-image', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div class="relative f fh bg-gray_pale w-full h-auto max-width-500 min-height-200 cursor-pointer mb4" onclick="{onSelectImage}"><img class="s-full object-fit-contain border" if="{url}" riot-src="{url}"> <div class="absolute trbl0 s-full f fh fs26">+</div> <div class="absolute tn16 rn16 bg-gray_pale f fh circle s32 border" if="{isDeletable()}" onclick="{delete}"> <div class="f fh s-full pb4 fs20">×</div> </div> </div> <div class="fs10 mb16" if="{!opts.field.options}">クリック または ドラッグ&ドロップで追加できます</div>', 'admin-field-image,[data-is="admin-field-image"]{display:block} admin-field-image .max-width-500,[data-is="admin-field-image"] .max-width-500{max-width:500px} admin-field-image .min-height-200,[data-is="admin-field-image"] .min-height-200{min-height:200px}', '', function (opts) {
  this.on('mount', () => {
    this.url = this.opts.riotValue;
    this.update();
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.accept = 'image/*';

    this.input.onchange = async e => {
      var file = e.currentTarget.files[0];
      if (!file) return;

      this._setFile(file);

      this.update();
    };

    this.root.ondragover = e => {
      return false;
    };

    this.root.ondrop = e => {
      var file = e.dataTransfer.files[0];
      if (!file) return;

      if (!this.validateFileImageOnly(file.type)) {
        e.preventDefault();
        spat.modal.alert('その形式のファイルは登録できません。');
        return;
      }

      this._setFile(file);

      return false;
    };
  });

  this.onSelectImage = async e => {
    e.preventDefault();

    if (this.opts.field.options && typeof this.opts.field.options.onclick === 'function') {
      var url = await this.opts.field.options.onclick();

      if (url) {
        this.url = url;
        this.update();
      }
    } else {
      this.input.click();
    }
  };

  this._setFile = async file => {
    this.file = file;
    this.url = URL.createObjectURL(file);
    this.update();
  };

  this.getValue = async () => {
    if (!this.file) {
      if (this.url === this.opts.riotValue) {
        return this.opts.riotValue;
      }

      if (/^http.+/.test(this.url)) {
        return this.url;
      }

      if (!this.url) {
        return "";
      }
    }

    let url = await app.admin.utils.uploadFile(this.file);
    return url;
  };

  this.validateFileImageOnly = type => {
    var re = /(^image\/\w*)/;
    return re.test(type);
  };

  this.delete = e => {
    e.stopPropagation();
    delete this.file;
    this.url = '';
    this.update();
  };

  this.isDeletable = () => {
    var deletable = true;

    if (this.opts.field.options && this.opts.field.options.deletable !== undefined) {
      deletable = this.opts.field.options.deletable;
    }

    return deletable && this.url || this.file;
  };
});
riot.tag2('admin-field-list', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div class="border"> <div ref="list" data-is="admin-module-list"></div> </div>', '', '', function (opts) {
  this.on('mount', () => {
    this.refs.list.setup({
      path: `${this.opts.item.path}/${this.opts.field.key}`
    });
  });
});
riot.tag2('admin-field-array', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div class="mb8" ref="items"> <div class="p8 border rounded-4 mb8" each="{item, index in items}"> <div class="f fm"> <div if="{!isReadOnly()}"><i class="material-icons mr4 handle cursor-grab">import_export</i></div> <div><span class="mr8">{index}.</span></div> <div class="w-full mr8" ref="fields" data-is="admin-field-{opts.field.options.field.type}" field="{opts.field.options.field}" riot-value="{item}"></div> <button if="{!isReadOnly()}" type="button" onclick="{onDeleteItem}"><i class="material-icons text-gray fs18">delete</i></button> </div> </div> </div> <div if="{!isReadOnly()}"> <button class="button" type="button" onclick="{onAdd}">追加</button> </div>', 'admin-field-array,[data-is="admin-field-array"]{display:block} admin-field-array .cursor-grab,[data-is="admin-field-array"] .cursor-grab{cursor:grab}', '', function (opts) {
  this.on('mount', async () => {
    this.items = this.opts.riotValue || [];
    this.update();

    if (!this.isReadOnly()) {
      Sortable.create(this.refs.items, {
        animation: 150,
        handle: '.handle',
        onEnd: async e => {
          var items = await this.getValue();
          var temp = items.splice(e.oldIndex, 1)[0];
          items.splice(e.newIndex, 0, temp);
          this.items = [];
          this.update();
          this.items = items;
          this.update();
        }
      });
    }
  });

  this.onAdd = async () => {
    this.items.push('');
    this.update();
  };

  this.onDeleteItem = async e => {
    var items = await this.getValue();
    items.splice(e.item.index, 1);
    this.items = [];
    this.update();
    this.items = items;
    this.update();
  };

  this.getValue = async () => {
    if (!this.refs.fields) return [];
    var fields = Array.isArray(this.refs.fields) ? this.refs.fields : [this.refs.fields];
    var promises = fields.map(async field => {
      return field.getValue();
    });
    var results = await Promise.all(promises);
    return results;
  };

  this.isReadOnly = () => {
    return this.opts.field.options ? this.opts.field.options.readonly : false;
  };
});
riot.tag2('admin-field-collection', '<div class="fs11 bold text-gray mb8" if="{opts.field.label}">{opts.field.label}</div> <div class="f fm w-full"> <div class="f fm w-full p8 border rounded-4 mr8" if="{item}"> <div class="w-full">{getItemLabel(item)}</div> <button type="button" onclick="{onDeleteItem}"><i class="material-icons text-gray fs18">delete</i></button> </div> <div class="flex-fixed"> <button class="button" type="button" onclick="{onOpenModal}">設定</button> </div> </div>', 'admin-field-collection,[data-is="admin-field-collection"]{display:block} admin-field-collection .cursor-grab,[data-is="admin-field-collection"] .cursor-grab{cursor:grab}', '', function (opts) {
  this.on('mount', async () => {
    this.item = null;

    if (this.opts.riotValue) {
      var item = await app.admin.crud.get({
        path: `${this.opts.field.options.collection}/${this.opts.riotValue}`
      });
      this.item = item;
    }

    this.update();
  });

  this.onOpenModal = async () => {
    var modal = spat.modal.open('admin-modal-collection', {
      options: this.opts.field.options
    });
    var item = await modal.waitClose();

    if (item) {
      this.item = item;
      riot.update();
    }
  };

  this.getItemValue = item => {
    return admin.utils.$get(item, this.opts.field.options.value_key);
  };

  this.getItemLabel = item => {
    return admin.utils.$get(item, this.opts.field.options.label_key);
  };

  this.onDeleteItem = e => {
    this.item = null;
    this.update();
  };

  this.getValue = () => {
    return this.item ? this.getItemValue(this.item) : '';
  };
});
riot.tag2('admin-field-button', '<button class="button" type="button" onclick="{onClick}">{this.opts.field.label}</button>', 'admin-field-button,[data-is="admin-field-button"]{display:block} admin-field-button .cursor-grab,[data-is="admin-field-button"] .cursor-grab{cursor:grab}', '', function (opts) {
  this.onClick = e => {
    let onclick = this.opts.field.options.onclick;

    if (onclick) {
      onclick({
        tag: this,
        field: this.opts.field,
        item: this.opts.item,
        value: this.opts.riotValue
      });
    }
  };
});
riot.tag2('admin-field-object', '<div class="fs11 bold text-gray mb8">{opts.field.label}</div> <div> <div class="mb8" each="{field, index in opts.field.options.fields}"> <div class="w-full mb8" ref="fields" data-is="admin-field-{field.type}" field="{field}" riot-value="{admin.utils.$get(opts.riotValue, field.key)}"></div> </div> </div>', 'admin-field-object,[data-is="admin-field-object"]{display:block}', '', function (opts) {
  this.on('mount', async () => {});

  this.getValue = async () => {
    var data = {};
    var fields = Array.isArray(this.refs.fields) ? this.refs.fields : [this.refs.fields];
    var promises = fields.map(async field => {
      if (!field.getValue) return;
      var value = field.getValue();

      if (value instanceof Promise) {
        value = await value;
      }

      admin.utils.$set(data, field.opts.field.key, value);
    });
    await Promise.all(promises);
    return data;
  };
});
},{}],"tags/admin-item.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-item-text', '<p class="line-clamp-1">{text || opts.riotValue}</p>', 'admin-item-text,[data-is="admin-item-text"]{display:block}', '', function (opts) {
  this.on('mount', async () => {
    let options = this.opts.heading.options;

    if (options) {
      let mappings = options.mappings;

      if (mappings && mappings[opts.riotValue]) {
        this.text = mappings[opts.riotValue];
        this.update();
      }

      let getValue = options.getValue;

      if (getValue) {
        let result = getValue({
          tag: this,
          value: this.opts.riotValue,
          item: this.opts.item
        });

        if (result instanceof Promise) {
          result = await result;
        }

        this.text = result;
        this.update();
      }
    }
  });
});
riot.tag2('admin-item-date', '<p if="{!opts.riotValue}">-</p> <p if="{opts.riotValue}">{dayjs(opts.riotValue).format(\'YYYY/MM/DD HH:mm\')}</p>', 'admin-item-date,[data-is="admin-item-date"]{display:block}', '', function (opts) {});
riot.tag2('admin-item-image', '<div class="rect-ogp bg-whitesmoke border"><img class="s-full object-fit-contain" if="{opts.riotValue}" riot-src="{opts.riotValue}"></div>', 'admin-item-image,[data-is="admin-item-image"]{display:block}', '', function (opts) {});
},{}],"tags/admin-modal-array.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-modal-array', '<div class="f flex-column bg-white w80vw h80vh rounded-8" ref="modal"> <div class="f fh p16 overflow-scroll h-full bg-whitesmoke"> <div> <input class="input w-full p4 mb8" type="{this.opts.type}" ref="input" riot-value="{opts.item}"> <div class="f fc"> <button class="block text-center p8 border rounded-4 bg-white hover-trigger hover-bg-dark mr16" type="button" onclick="{onCancel}">キャンセル</button> <button class="block text-center p8 border rounded-4 bg-white hover-trigger hover-bg-dark" type="button" onclick="{onAdd}">追加</button> </div> </div> </div> </div>', 'admin-modal-array,[data-is="admin-modal-array"]{background-color:rgba(0,0,0,0.5)}', 'class="f fh"', function (opts) {
  this.onAdd = e => {
    this.value = this.refs.input.value;
    this.close();
  };

  this.onCancel = e => {
    this.value = false;
    this.close();
  };
});
},{}],"tags/admin-modal-collection.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-modal-collection', '<div class="f flex-column bg-white w80vw h80vh rounded-8" ref="modal"> <form class="h80 f fr fm p16 border-bottom" onsubmit="{onSearch}"> <div class="f"> <input class="input mr8" ref="search" type="search" placeholder="Search"> <button class="button">検索</button> </div> </form> <div class="p16 overflow-scroll h-full bg-whitesmoke"> <button class="block w-full text-left p8 border rounded-4 bg-white hover-trigger hover-bg-dark mb8" type="button" each="{item, index in candidates}" riot-value="{getItemValue(item)}" onclick="{onSelect}">{index}. {getItemLabel(item)}</button> </div> </div>', 'admin-modal-collection,[data-is="admin-modal-collection"]{background-color:rgba(0,0,0,0.5)}', 'class="f fh"', function (opts) {
  this.on('mount', () => {
    this.syncCandidates();
  });

  this.syncCandidates = async () => {
    var data = {
      path: `${this.opts.options.collection}`,
      keyword: this.refs.search.value
    };

    if (this.opts.options.filters) {
      data.filters = this.opts.options.filters;
    }

    var res = await app.admin.crud.index(data);
    this.candidates = res.items;
    this.update();
  };

  this.onSearch = e => {
    e.preventDefault();
    this.syncCandidates();
  };

  this.getItemValue = item => {
    return admin.utils.$get(item, this.opts.options.value_key);
  };

  this.getItemLabel = item => {
    return admin.utils.$get(item, this.opts.options.label_key);
  };

  this.onSelect = e => {
    this.value = e.item.item;
    this.close();
  };
});
},{}],"tags/admin-module-form.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-module-form', '<form class="row mxn16" id="form1" if="{visible}" ref="form" onsubmit="{onSubmit}"> <div class="mb32 s-w-full {form.class}" each="{form in schema.forms}"> <div class="box-shadow rounded-4 bg-white p32 mx16"> <div class="mb16"> <div class="fs18 bold mb8">{form.label}</div> <div class="h2 w-full bg-primary"></div> </div> <div class="row"> <div class="block w-full mb32 {field.class}" each="{field in form.fields}" if="{isVisibleField(field)}"> <div ref="fields" data-is="admin-field-{field.type}" field="{field}" riot-value="{admin.utils.$get(item, field.key)}" item="{item}"></div> </div> </div> </div> </div> <button class="hide" ref="btn">submit</button> </form>', 'admin-module-form,[data-is="admin-module-form"]{display:block}', '', function (opts) {
  this.visible = true;

  this.setup = async ({
    path
  }) => {
    this.path = path;
    this.id = app.utils.path.basename(path);
    this.basename = app.utils.path.dirname(path);
    this.collection = this.basename.split('/').pop();
    this.reset();

    if (this.id !== 'new') {
      var item = await app.admin.crud.get({
        path: path
      });
      this.item = item;
    }

    var schema_path = path.split('/').filter((path, index) => {
      return index % 2 === 0;
    }).join('.');
    var schema = admin.utils.$get(app.admin.schema, schema_path) || app.admin.schema[this.collection + '/' + this.id];
    this.schema = schema;
    this.update();
  };

  this.reset = () => {
    this.update({
      visible: false
    });
    this.update({
      visible: true
    });
  };

  this.submit = () => {
    this.refs.btn.click();
  };

  this.onSubmit = e => {
    e.preventDefault();
    this.save();
  };

  this.save = async () => {
    var data = {};
    var fields = Array.isArray(this.refs.fields) ? this.refs.fields : [this.refs.fields];
    var promises = fields.map(async field => {
      if (!field.getValue) return;
      var value = field.getValue();

      if (value instanceof Promise) {
        value = await value;
      }

      admin.utils.$set(data, field.opts.field.key, value);
    });
    await Promise.all(promises);

    if (!this.item) {
      var item = await app.admin.crud.post({
        path: this.collection,
        data
      });
      this.trigger('create', {
        item
      });
      this.opts.oncreate && this.opts.oncreate({
        item
      });
      spat.router.replace(`/${item.path}`);
    } else {
      var item = await app.admin.crud.put({
        path: this.path,
        data
      });
      this.item = item;
      this.trigger('save', {
        item
      });
    }

    this.update();
    spat.toast.message('保存しました!');
  };

  this.del = async () => {
    let result = await spat.modal.confirm('本当に削除しますか？');
    if (!result) return;
    await app.admin.crud.del({
      path: this.path
    });
    spat.toast.message('削除しました!');
    spat.router.replace(`/${this.collection}`);
  };

  this.isVisibleField = field => {
    if (!field.options || typeof field.options.visible !== 'function') return true;
    return field.options.visible({
      item: this.item,
      field
    });
  };
});
},{}],"tags/admin-module-header.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-module-header', '<div class="bg-white box-shadow relative"> <div class="h60 f fbw fm px16"> <div class="f fm"> <div class="f fm item" each="{item in getBreadcrumbs()}"><a class="fs16 bold" if="{item.link}" href="{item.link}">{item.label}</a> <div class="fs16 bold text-gray" if="{!item.link}">{item.label}</div> <div class="text-gray arrow mx8">></div> </div> </div> <div class="f fm" if="{opts.list}"> <div class="ml8" if="{canCreate()}"><a class="button primary" href="/{opts.path}/new">NEW</a></div> </div> <div class="f fm" if="{opts.form}"> <div class="ml8" if="{canDelete()}"> <button class="button danger py6" type="button" onclick="{onDelete}"><i class="fs18 material-icons">delete</i></button> </div> <div class="ml8" if="{canUpdate()}"> <button class="primary button" onclick="{onSubmit}">SAVE</button> </div> </div> </div> </div>', 'admin-module-header,[data-is="admin-module-header"]{display:block} admin-module-header .item:last-child .arrow,[data-is="admin-module-header"] .item:last-child .arrow{display:none}', '', function (opts) {
  this.on('mount', () => {});

  this.getBreadcrumbs = () => {
    let items = [{
      label: 'TOP',
      link: '/'
    }];

    if (this.opts.list) {
      items.push({
        label: this.opts.list.schema.label,
        link: `/${opts.path}`
      });
    } else if (this.opts.form) {
      if (this.opts.form.basename.includes('/')) {
        let paths = this.opts.form.basename.split('/');
        var link = "";
        var schema = app.admin.schema;

        for (var i = 0; i <= paths.length - 2; i += 2) {
          schema = schema[paths[i]];
          var item = {
            label: schema.label
          };

          if (app.admin.menu[0].items.some(item => item.link === `/${paths[i]}`)) {
            link = `/${paths[i]}`;
            item.link = link;
            link += `/${paths[i + 1]}`;
          } else {
            link += `/${paths[i]}/${paths[i + 1]}`;
          }

          items.push(item);
          items.push({
            label: `${paths[i + 1]}`,
            link: link
          });
        }

        items.push({
          label: this.opts.form.schema.label
        });
      } else {
        items.push({
          label: this.opts.form.schema.label,
          link: `/${this.opts.form.collection}`
        });
      }

      items.push({
        label: this.opts.form.id,
        link: `/${this.opts.form.path}`
      });
    }

    return items;
  };

  this.isLast = index => {
    return this.opts.items.length - 1 <= index;
  };

  this.onSubmit = () => {
    this.opts.form.submit();
  };

  this.onDelete = () => {
    this.opts.form.del();
  };

  this.canCreate = () => {
    return opts.list && opts.list.schema.crud && opts.list.schema.crud.create;
  };

  this.canUpdate = () => {
    return opts.form && opts.form.schema.crud && opts.form.schema.crud.update;
  };

  this.canDelete = () => {
    return opts.form && opts.form.schema.crud && opts.form.schema.crud.delete;
  };
});
},{}],"tags/admin-module-list.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-module-list', '<div class="h80 f fbw fm p16 border-bottom" show="{schema.search !== false}"> <div class="f fm"> <div class="mr16" ref="filters" each="{filter in schema.filters}" data-is="admin-module-list-filter_" filter="{filter}" onchange="{search}"></div> </div> <form onsubmit="{onSearch}"> <div class="f"> <input class="input mr8" ref="search" type="search" placeholder="Search"> <button class="button">検索</button> </div> </form> </div> <div class="overflow-x-scroll"> <table class="w-full w-full border-spacing-0 border-collapse-collapse"> <thead> <tr> <th class="border-bottom" each="{heading in schema.headings}" riot-style="min-width: {heading.width || &quot;100px&quot;}; width: {heading.width || &quot;100%&quot;}"> <div class="w-full text-left fs11 text-gray px12 py16 bold">{heading.label}</div> </th> </tr> </thead> <tbody> <tr class="border-bottom hover-trigger hover-bg-dark cursor-pointer" each="{item in items}" onclick="{onSelect}"> <td class="p12" each="{heading in schema.headings}"> <div class="fs13" data-is="admin-item-{heading.type}" riot-value="{admin.utils.$get(item, heading.key)}" heading="{heading}"></div> </td> </tr> </tbody> </table> <div class="f fh py10" if="{next_cursor}"> <button class="button" type="button" onclick="{fetch}">もっと見る</button> </div> </div>', 'admin-module-list,[data-is="admin-module-list"]{display:block}', '', function (opts) {
  this.setup = async ({
    path
  }) => {
    this.reset();
    var schema_path = path.split('/').filter((path, index) => {
      return index % 2 === 0;
    }).join('.');
    var schema = admin.utils.$get(app.admin.schema, schema_path) || app.admin.schema[this.collection + '/' + this.id];
    this.schema = schema;
    this.path = path;
    await this.fetch();
  };

  this.reset = () => {
    this.items = [];
    this.next_cursor = '';
  };

  this.getList = () => {
    var list = Object.assign(app.admin);
  };

  this.onSelect = e => {
    const root = opts.root || '/';
    this.trigger('select', {
      item: e.item.item
    });
    spat.router.push(`${root}${e.item.item.path}`);
  };

  this.fetch = async () => {
    var keyword = this.refs.search.value;
    var filters = {};

    if (this.refs.filters) {
      var filters_tag = Array.isArray(this.refs.filters) ? this.refs.filters : [this.refs.filters];
      filters_tag.forEach(tag => {
        filters[tag.opts.filter.key] = tag.getValue();
      });
    }

    var {
      items,
      next_cursor
    } = await app.admin.crud.index({
      path: this.path,
      cursor: this.next_cursor,
      keyword,
      filters
    });
    this.items.push(...items);
    this.next_cursor = next_cursor;
    this.update();
  };

  this.search = () => {
    this.reset();
    this.fetch();
  };

  this.onSearch = e => {
    e.preventDefault();
    this.search();
  };
});
riot.tag2('admin-module-list-filter_', '<div class="text-center"> <div class="fs11 bold mb4">{opts.filter.label}</div> <select class="px8 py8 border rounded-4" ref="filter" onchange="{opts.onchange}"> <option value="----">----</option> <option each="{option in options}" riot-value="{option.value}">{option.label}</option> </select> </div>', 'admin-module-list-filter_,[data-is="admin-module-list-filter_"]{display:block}', '', function (opts) {
  this.on('mount', async () => {
    let options = opts.filter.options;

    if (typeof options === 'function') {
      options = options();

      if (options instanceof Promise) {
        options = await options;
      }
    }

    this.update({
      options
    });
  });

  this.getValue = () => {
    return this.refs.filter.value !== '----' ? this.refs.filter.value : '';
  };
});
},{}],"tags/admin-module-menu.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-module-menu', '<div class="relative f fh fbw fclm p16 min-h100vh bg-primary text-white"> <div> <div class="p16 f fh mb32"><a href="/"><img riot-src="{opts.logo}"></a></div> <div class="mb32" each="{section in opts.menu}"> <div class="bold fs12 mb8">{section.label}</div> <div> <div class="hover-trigger hover-bg-light rounded-8 pl8" each="{item in section.items}"><a class="p8 block {&quot;rounded-top-left-full rounded-bottom-left-full bg-whitesmoke pl16 bold text-gray mrn16 mln8&quot;: location.pathname.indexOf(item.link) === 0}" href="{item.link}">{item.label}</a></div> </div> </div> </div> <div class="f fh fclm mb32"> <div class="mb16">{firebase.auth().currentUser.email}</div> <button class="button fs12 p8" onclick="{signOut}">ログアウト</button> </div> </div>', 'admin-module-menu,[data-is="admin-module-menu"]{display:block} admin-module-menu .min-h100vh,[data-is="admin-module-menu"] .min-h100vh{min-height:100vh}', '', function (opts) {
  this.signOut = async () => {
    var result = await spat.modal.confirm('ログアウトしますか?');
    if (!result) return;
    firebase.auth().signOut();
    spat.router.push('/login');
  };
});
},{}],"tags/admin-page.pug":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('admin-page', '<div class="s-full f fh"> <div class="h-full w200 flex-fixed overflow-y-scroll s-hide" data-is="admin-module-menu" menu="{app.admin.menu}" logo="{opts.logo || &quot;/images/logo_color.png&quot;}"></div> <div class="s-full f flex-column overflow-hidden"> <header data-is="admin-module-header" path="{path}" list="{refs.list}" form="{refs.form}"></header> <div class="p32 overflow-y-scroll s-p16"> <div if="{type === &quot;list&quot;}"> <div class="box-shadow rounded-4 bg-white" ref="list" data-is="admin-module-list"></div> </div> <div if="{type === &quot;form&quot;}"> <div ref="form" data-is="admin-module-form"></div> </div> <yield></yield> </div> </div> </div>', 'admin-page,[data-is="admin-page"]{display:block}', 'class="s-full"', function (opts) {
  this.setup = async ({
    path
  }) => {
    path = path[0] === '/' ? path.slice(1) : path;
    if (!path) return;
    this.path = path;
    let pathes = path.split('/');

    if (pathes.length % 2 === 1) {
      this.update({
        type: 'list'
      });
      await this.refs.list.setup({
        path: path
      });
      this.schema = this.refs.list.schema;
    } else {
      this.update({
        type: 'form'
      });
      await this.refs.form.setup({
        path: path
      });
      this.schema = this.refs.form.schema;
    }

    this.update();
  };

  this.canCreate = () => {
    return this.refs.list.schema.crud && this.refs.list.schema.crud.create;
  };
});
},{}],"tags/**/*.pug":[function(require,module,exports) {
module.exports = {
  "admin-field": require("./../admin-field.pug"),
  "admin-item": require("./../admin-item.pug"),
  "admin-modal-array": require("./../admin-modal-array.pug"),
  "admin-modal-collection": require("./../admin-modal-collection.pug"),
  "admin-module-form": require("./../admin-module-form.pug"),
  "admin-module-header": require("./../admin-module-header.pug"),
  "admin-module-list": require("./../admin-module-list.pug"),
  "admin-module-menu": require("./../admin-module-menu.pug"),
  "admin-page": require("./../admin-page.pug")
};
},{"./../admin-field.pug":"tags/admin-field.pug","./../admin-item.pug":"tags/admin-item.pug","./../admin-modal-array.pug":"tags/admin-modal-array.pug","./../admin-modal-collection.pug":"tags/admin-modal-collection.pug","./../admin-module-form.pug":"tags/admin-module-form.pug","./../admin-module-header.pug":"tags/admin-module-header.pug","./../admin-module-list.pug":"tags/admin-module-list.pug","./../admin-module-menu.pug":"tags/admin-module-menu.pug","./../admin-page.pug":"tags/admin-page.pug"}],"main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _riot = _interopRequireDefault(require("riot"));

require("./tags/**/*.pug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './tags/admin-field.pug';
// import './tags/admin-item.pug';
// import './tags/admin-page.pug';
var admin = {
  utils: {
    '$get': (obj, key) => {
      return key.split('.').reduce(function (t, v) {
        return t && t[v];
      }, obj);
    },
    '$set': (obj, key, value) => {
      key.split('.').reduce(function (t, v, i, arr) {
        if (i === arr.length - 1) {
          t[v] = value;
        } else {
          if (!t[v]) t[v] = {};
          return t[v];
        }
      }, obj);
    }
  }
};
var _default = admin;
exports.default = _default;
},{"./tags/**/*.pug":"tags/**/*.pug"}]},{},["main.js"], "admin")