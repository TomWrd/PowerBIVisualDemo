/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import * as React from "react";
import * as ReactDOM from "react-dom";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import ProgressBar from '@ramonak/react-progress-bar';

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;
    private wrapper: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (document) {

            this.wrapper = document.createElement("div");
            this.wrapper.setAttribute("class", "visual-wrapper");
            this.target.append(this.wrapper);

            /*
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Update count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);
            */
        }
    }

    public update(options: VisualUpdateOptions) {
        /*
            Re-render each time component is updated
        */
        document.getElementsByClassName('visual-wrapper')[0].innerHTML = "";

        console.log("Visual data: " + JSON.stringify(options.dataViews[0].categorical));

        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
        if( options.dataViews[0].categorical?.categories?.length > 0)
        {
            options.dataViews[0].categorical.categories[0].values.forEach((category, i) => {
                var listItem = document.createElement("div");
                listItem.setAttribute("class", "list-item row-"+i);

                var imageItem = document.createElement("img");
                imageItem.setAttribute("class", "category-image");
                imageItem.setAttribute("src", options.dataViews[0].categorical.categories[1].values[i] as string);
                listItem.appendChild(imageItem);

                var categoryItem = document.createElement("span");
                categoryItem.setAttribute("class", "category-title");
                categoryItem.innerHTML = category as string;
                listItem.appendChild(categoryItem);

                this.wrapper.append(listItem);
            })
        }

        if( options.dataViews[0].categorical?.values[0].values.length > 0)
        {
            console.log(JSON.stringify( options.dataViews[0].categorical.values[0].values));
            options.dataViews[0].categorical.values[0].values.forEach((value, i) => {
                /*
                    Calculate percentage fill
                */
                var percentFill = Math.floor((Number.parseFloat(value as string) / Number.parseFloat(options.dataViews[0].categorical.values[0].maxLocal as string)) * 100); 
                var count = (Number.parseFloat(value as string));
                /*
                    Set color based on fill
                */
                var bgColor = "";
                if(percentFill < 25){
                    bgColor = "red";
                } else if(percentFill < 75){
                    bgColor = "yellow";
                } else {
                    bgColor = "green";
                }
                
                /*
                    Create an HTML element to render the React component to
                        Make sure to add the html elment to the proper corresponding list item index
                */
               var listItem = document.createElement("span");
               listItem.setAttribute("class", "progress-indicator");
               this.reactRoot = React.createElement(ProgressBar, {completed: percentFill, bgcolor: bgColor, label: count});
               try{
                if(this.settings.displayCount.show)
                {
                    var satCount = document.createElement("span");
                    satCount.setAttribute("class", "count-text");
                    satCount.innerHTML = "Count: " + value;
                    document.getElementsByClassName("row-"+i)[0].append(satCount);
                }
                else {
                    listItem.setAttribute("class", "progress-indicator no-count")
                }
                    document.getElementsByClassName("row-"+i)[0].append(listItem);
                    ReactDOM.render(this.reactRoot, listItem);
                }
                catch(ex)
                {
                    console.log(ex);
                }
            })
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}