/**
 * ===========================================================================================
 * File js test
 * ===========================================================================================
 */
var aaaas = aaaa || {};

(function() {
    "use strict";

    const SCRIPT = document.currentScript;

    class Block extends exblock.ToolbarGird {

        constructor(config) {
            super(config);
            this.script = SCRIPT;
            this.eventListener();
        }

        loadBlock(callback) {
            var self = this;

            super.loadBlock(() => {

                self.getModelByUrl();
                self.loadToolbar(() => {
                    self.loadContent(() => {
                        self.loadAction(() => {
                            if (callback) {
                                callback();
                            }
                        })
                    });
                });
            });
        }

        loadToolbar(callback) {
            var self = this;

            if (!self.toolbar) {
                var containerId = self.getElementId('toolbar');
                self.toolbar = new dhx.Toolbar(containerId, {});
            }

            if (!self.toolbarItems) {
                return self.getFile(self.script.src.replace('index.js', 'toolbar.json'), (str) => {
                    if (!self.configPopup) {
                        self.getFile(self.script.src.replace('index.js', 'popup.json'), (str2) => {
                            self.configPopup = JSON.parse(str2);
                        })
                    }
                    self.toolbarItems = JSON.parse(str);

                    var buttons = JSON.parse(JSON.stringify(self.toolbarItems));
                    self.toolbar.data.parse(buttons);
                    self.toolbarShowHide();

                    dhx.awaitRedraw().then(function() {
                        callback();
                    });
                });
            }

            var buttons = JSON.parse(JSON.stringify(self.toolbarItems));
            self.toolbar.data.parse(buttons);
            self.toolbarShowHide();
            document.getElementById("checkbox_all").checked = false;

            dhx.awaitRedraw().then(function() {
                callback();
            });
        }

        loadContent(callback) {
            var self = this;

            self.loadGrid();

            self.getDataList(null, () => {
                var dataset = self.buildDataset();
                self.gridView.data.parse(dataset);
                dhx.awaitRedraw().then(function() {
                    callback();
                });
            });
        }

        loadGrid(reload = null, callback) {
            var self = this;

            if (!self.gridView) {
                var containerId = self.getElementId('grid-view');
                self.gridView = new dhx.Grid(containerId, {
                    columns: [
                        { width: 65, id: "checkbox", header: [{ text: "Check" }], type: "boolean", editable: true },
                        {
                            width: 65,
                            id: "thumb",
                            header: [{ text: "Thumb" }],
                            htmlEnable: true,
                            align: "center",
                            template: function(text, item, row) {
                                let thumbUrl = item.thumb ? item.thumb : "https://snippet.dhtmlx.com/codebase/data/dataview/01/img/07.jpg";

                                let html = "<span class='item_thumb'><img src='" + thumbUrl + "'></span>";
                                return html;
                            }
                        },
                        {
                            minWidth: 200,
                            maxWidth: 1000,
                            id: "title",
                            header: [{ text: "Title" }],
                            htmlEnable: true,
                            template: function(text, item, row) {
                                let html = "";
                                html += "       <div class='item_content'>";
                                html += "           <div class='item_title'>" + (item.title || item.name) + "</div>";
                                html += "           <div class='item_time item_cat'>";
                                html += "               <span class='dhx_menu-button__icon mdi mdi-clock-outline'>" + "13/05/2021" + "</span>";
                                html += "               <span class='dhx_menu-button__icon mdi mdi-account-edit-outline'>" + "mr author" + "</span>";
                                html += "           </div>";
                                html += "       </div>";
                                return html

                            }
                        },
                        { minWidth: 50, maxWidth: 100, id: "status", header: [{ text: "Status", align: "center" }], align: "center", },
                        {
                            minWidth: 200,
                            maxWidth: 1000,
                            id: "action",
                            header: [{ text: "Action", align: "center" }],
                            htmlEnable: true,
                            align: "center",
                            template: function(text, item, row) {
                                let html = "";
                                html += '<div class="group_action">';
                                html += '    <div class="page_action" style="display: flex; justify-content: space-between">';
                                html += '        <button class="dhx_button dhx_nav-menu-button page_edit" type="button">';
                                html += '            <span href="#" action="edit" class="dhx_menu-button__icon mdi mdi-square-edit-outline"></span>';
                                html += '        </button>';
                                html += '        <button class="dhx_button dhx_nav-menu-button page_view" type="button">';
                                html += '            <span href="#" action="view" class="dhx_menu-button__icon mdi mdi-eye"></span>';
                                html += '        </button>';
                                html += '        <button class="dhx_button dhx_nav-menu-button page_delete" type="button">';
                                html += '            <span action="delete" class="dhx_menu-button__icon mdi mdi-delete"></span>';
                                html += '        </button>';
                                html += '    </div>';
                                html += '</div>';

                                return html
                            }
                        }
                    ],
                    autoWidth: true,
                    tooltip: false,
                    selection: "row",
                    autoEmptyRow: false,
                    rowHeight: 65,
                    eventHandlers: {
                        onclick: {
                            page_edit: function(event, target) {
                                console.log("edit", target);
                                self.editPage(target.row)
                            },
                            page_view: function(event, data) {
                                console.log("view", data);
                            },
                            page_delete: function(event, target) {
                                console.log("delete", target);
                                self.delete({ items: [target.row] })

                            },
                        }

                    }

                });
            };

            if (reload == "repaint") {
                if (self.gridView) {
                    self.stateReload = self.gridView.data.serialize();
                    self.gridView.destructor();
                    delete self.gridView;

                    self.loadGrid();

                    self.gridView.data.parse(self.stateReload);
                    delete self.stateReload;

                    self.loadAction();
                }

            }


            if (callback) { callback() }
        }

        fakeData() {
            var self = this;

            let it = {};

            for (let i = 1; i < 100; i++) {
                console.log(i)
                it.title = `Page Nhân Sinh Cảm Ngộ  ${i}`

                it.status = i % 2 == 0 ? "publish" : "draft";

                net.api.saveDataItem("kmvo0eyf-page", it, res => {})
            }
        }

        buildDataset() {
            var self = this;
            var dataset = [];

            self.dataList.forEach((item) => {
                dataset.push({
                    checkbox: false,
                    id: item.id,
                    loc: item.loc,
                    thumb: item.thumb,
                    title: item.title,
                    status: item.status,
                    author: item.author,
                    category: item.category
                });
            });

            return dataset;
        }

        loadAction(callback) {
            var self = this;

            //events toolbar
            self.toolbarUpdatePagination();
            if (!self.toolbar._loadAction) {
                self.toolbar._loadAction = true;

                self.registerEvents(["toolbarDelete", "chooseAll", "filter", "toolbarEdit", "toolbarPagination"]);
            }

            //events gridView
            if (!self.gridView._loadAction) {
                self.gridView._loadAction = true;

                self.registerEvents(["gridHover", "gridCheckbox"]);

                self.gridView.events.on("cellClick", (item, col, row) => {
                    console.log("item", item)
                })

            }

            if (callback) { callback() }
        }

        toolbarShowHide(length = 0) {
            var self = this;
            if (length == 0) {
                try {
                    document.getElementById("checkbox_all").checked = false;
                } catch (error) {}
            }
            switch (length) {
                case 0:
                    self.toolbar.hide(["delete", "edit", "selected"]);
                    self.toolbar.disable(["delete", "edit", ]);
                    break;
                case 1:
                    self.toolbar.show(["delete", "edit", "selected"]);
                    self.toolbar.enable(["delete", "edit", ]);
                    break;
                default:
                    self.toolbar.hide(["edit", ]);
                    self.toolbar.disable(["edit", ]);
                    self.toolbar.show(["delete", "selected"]);
                    self.toolbar.enable(["delete", ]);
                    break;
            }
        }



        editPage(item) {
            var self = this;
            console.log("edit Item", item)
        }

        updateSelected(count = 0) {
            var self = this;
            super.updateSelected(count);
            let item = count > 1 ? "items" : "item";
            let html = `<div> Selected <span class = 'items_selected' id = "items_selected">${count}</span> ${item} </div>`
            self.toolbar.data.update("selected", { html: html });
        }







        eventListener() {
            var self = this;

            block.event.clear("OnSearch");
            block.event.on("OnSearch", (eventName, what, src) => {
                // console.log(eventName, what);

                //========= FIXED ME, remove this code

                if (what.keyword) {
                    self.offset.pageCurrent = 1;
                    what.title = what.keyword;
                    what.op = "title:ct"
                    delete what.keyword;
                }
                //========= End

                what.loc = self.model.spaceLoc;
                app.goto(what);
            });
        }


    }



    // export
    block["page-list"] = Block;
})();