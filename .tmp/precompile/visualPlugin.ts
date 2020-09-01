import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var demo63110654E82D42DF8DFDED5754211F0C1232: IVisualPlugin = {
    name: 'demo63110654E82D42DF8DFDED5754211F0C1232',
    displayName: 'Custom Visual Demo',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["demo63110654E82D42DF8DFDED5754211F0C1232"] = demo63110654E82D42DF8DFDED5754211F0C1232;
}

export default demo63110654E82D42DF8DFDED5754211F0C1232;