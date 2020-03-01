#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const update_notifier_1 = __importDefault(require("@yarn-tool/update-notifier"));
const getPort_1 = __importStar(require("../lib/getPort"));
const index_1 = __importDefault(require("../index"));
update_notifier_1.default([__dirname, '..']);
let argv = yargs_1.default
    .option('port', {
    number: true,
    alias: ['p'],
    default: getPort_1.default(getPort_1.getPortEnv())
})
    .option('proxy', {
    string: true,
})
    .argv;
exports.default = index_1.default(argv);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92ZWwtb3Bkcy1ub3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3ZlbC1vcGRzLW5vdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsa0RBQTBCO0FBQzFCLGlGQUF3RDtBQUN4RCwwREFBcUQ7QUFDckQscURBQW1DO0FBRW5DLHlCQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUVsQyxJQUFJLElBQUksR0FBRyxlQUFLO0tBQ2QsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ1osT0FBTyxFQUFFLGlCQUFPLENBQUMsb0JBQVUsRUFBRSxDQUFDO0NBQzlCLENBQUM7S0FDRCxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQ2hCLE1BQU0sRUFBRSxJQUFJO0NBQ1osQ0FBQztLQUNELElBQUksQ0FDTDtBQUVELGtCQUFlLGVBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCB1cGRhdGVOb3RpZmllciBmcm9tICdAeWFybi10b29sL3VwZGF0ZS1ub3RpZmllcic7XG5pbXBvcnQgZ2V0UG9ydCwgeyBnZXRQb3J0RW52IH0gZnJvbSAnLi4vbGliL2dldFBvcnQnO1xuaW1wb3J0IHN0YXJ0U2VydmVyIGZyb20gJy4uL2luZGV4JztcblxudXBkYXRlTm90aWZpZXIoW19fZGlybmFtZSwgJy4uJ10pO1xuXG5sZXQgYXJndiA9IHlhcmdzXG5cdC5vcHRpb24oJ3BvcnQnLCB7XG5cdFx0bnVtYmVyOiB0cnVlLFxuXHRcdGFsaWFzOiBbJ3AnXSxcblx0XHRkZWZhdWx0OiBnZXRQb3J0KGdldFBvcnRFbnYoKSlcblx0fSlcblx0Lm9wdGlvbigncHJveHknLCB7XG5cdFx0c3RyaW5nOiB0cnVlLFxuXHR9KVxuXHQuYXJndlxuO1xuXG5leHBvcnQgZGVmYXVsdCBzdGFydFNlcnZlcihhcmd2KTtcbiJdfQ==