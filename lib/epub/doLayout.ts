/**
 * Created by user on 2020/1/30.
 */

import novelText from '@node-novel/layout';
import getBuildInRule, { getBuildInRulePath } from '@node-novel/layout-pattern/lib/rules';
import { IPatternRule } from '@node-novel/layout-pattern/lib/core/types';
import { IRuleListKey } from '@node-novel/layout-pattern/lib/rules-keys';

let ruleData: {
	rule_tpl: ReturnType<typeof getRule>,
	rule_base: ReturnType<typeof getRule>,
};

function initRuleData()
{
	if (ruleData == null)
	{
		ruleData = {
			rule_tpl: getRule('demo.lf2.cht'),
			rule_base: getRule('base-v2'),
		}
	}

	return ruleData;
}

function _my_words(ruleData: {
	rule_tpl: ReturnType<typeof getRule>,
	rule_base: ReturnType<typeof getRule>,
})
{
	let words = [];
	let arr = [];

	words = words.concat(ruleData.rule_tpl.words || []);
	arr = arr.concat(ruleData.rule_tpl.words_arr || []);

	words = words.concat(ruleData.rule_base.words || []);
	arr = arr.concat(ruleData.rule_base.words_arr || []);

	words = words.concat(ruleData.rule_tpl.words || []);
	arr = arr.concat(ruleData.rule_tpl.words_arr || []);

	words = novelText._words1(arr, words);

	return novelText._words2(words);
}

function getRule<T extends IRuleListKey>(id: T)
{
	let rule = getBuildInRule(id);

	return {
		...rule,
		words_arr: [] as string[],
	}
}

function my_words(html: Buffer | string, ruleData: {
	rule_tpl: ReturnType<typeof getRule>,
	rule_base: ReturnType<typeof getRule>,
})
{
	html = html.toString();

	let words = _my_words(ruleData);

	let ret = novelText.replace_words(html, words);

	html = ret.value;

	return html
}

export function handleContext(_t_old: Buffer | string, meta?: {
	options?: {
		textlayout?: {
			allow_lf2?: boolean,
		}
	}
})
{
	let _t = novelText.toStr(_t_old);

	if (meta && meta.options && meta.options.textlayout && !meta.options.textlayout.allow_lf2)
	{
		_t = novelText.reduceLine(_t, meta.options.textlayout || {});
	}

	_t = my_words(_t, initRuleData());
	_t = novelText.textlayout(_t, {});
	_t = my_words(_t, ruleData);

	_t = novelText.replace(_t, {
		words: true,
	});

	_t = novelText.trim(_t);

	return _t;
}

export default handleContext
