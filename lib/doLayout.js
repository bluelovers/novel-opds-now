"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleContext = void 0;
const layout_1 = __importDefault(require("@node-novel/layout"));
const rules_1 = __importDefault(require("@node-novel/layout-pattern/lib/rules"));
let ruleData;
function initRuleData() {
    if (ruleData == null) {
        ruleData = {
            rule_tpl: getRule('demo.lf2.cht'),
            rule_base: getRule('base-v2'),
        };
    }
    return ruleData;
}
function _my_words(ruleData) {
    let words = [];
    let arr = [];
    words = words.concat(ruleData.rule_tpl.words || []);
    arr = arr.concat(ruleData.rule_tpl.words_arr || []);
    words = words.concat(ruleData.rule_base.words || []);
    arr = arr.concat(ruleData.rule_base.words_arr || []);
    words = words.concat(ruleData.rule_tpl.words || []);
    arr = arr.concat(ruleData.rule_tpl.words_arr || []);
    words = layout_1.default._words1(arr, words);
    return layout_1.default._words2(words);
}
function getRule(id) {
    let rule = rules_1.default(id);
    return {
        ...rule,
        words_arr: [],
    };
}
function my_words(html, ruleData) {
    html = html.toString();
    let words = _my_words(ruleData);
    let ret = layout_1.default.replace_words(html, words);
    html = ret.value;
    return html;
}
function handleContext(_t_old, meta) {
    let _t = layout_1.default.toStr(_t_old);
    if (meta && meta.options && meta.options.textlayout && !meta.options.textlayout.allow_lf2) {
        _t = layout_1.default.reduceLine(_t, meta.options.textlayout || {});
    }
    _t = my_words(_t, initRuleData());
    _t = layout_1.default.textlayout(_t, {});
    _t = my_words(_t, ruleData);
    _t = layout_1.default.replace(_t, {
        words: true,
    });
    _t = layout_1.default.trim(_t);
    return _t;
}
exports.handleContext = handleContext;
exports.default = handleContext;
//# sourceMappingURL=doLayout.js.map