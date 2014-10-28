var Singleton = (function($, Singleton) {

    "use strict";

    Singleton = Singleton || {};

    // constructor
    Singleton.listItems = function(options) {
        this.listId = options.listNode.attr('id');
        this.url = options.listNode.data("url");
        this.filter = options.initFilter;
        this.max = options.max;
        switch (options.listNode.data("itemtype")) {
            case "article":
                this.displayList = this.displayArticles;
                break;
        }
    };
    var proto = Singleton.listItems.prototype;

    // update filter on select2 change
    proto.setSelectFilter = function() {
        var self = this;
        $('.cl-select-filter').on("change", function(e) {
            console.log(e.val);
            if (e.val) {
                self.filter.select = { "articleId": e.val };
            } else {
                delete self.filter.select;
            }
            self.list(); 
        });
    };
    
    proto.setSearch = function() {
        var self = this;
        // to launch search, press enter ...
        $(".cl-list-search").keyup(function(e) {
            if (e.keyCode == 13) {
                $('#page-selection').bootpag({page: 1});
                self.filter['offset'] = 0;
                self.filter.search = { "query": $(".cl-list-search").val() };
                self.list(); 
            }
        });
        // or click on the button ! (like old people)
        $(".cl-list-search-btn").click(function() {
            $('#page-selection').bootpag({page: 1});
            self.filter['offset'] = 0;
            self.filter.search = { "query": $(".cl-list-search").val() };
            self.list(); 
        });
    };

    proto.setTabsClicks = function(fct) {
        var self = this;
        // for each tab click
        $(".cl-tabs li").each(function() {

            $(this).click(function() {
                $('#page-selection').bootpag({page: 1});
                self.filter['offset'] = 0;
                // update tab apparence 
                if (fct) { fct(this); }
                // update filter
                self.filter.tab = {
                    "type": $(this).data("filter-type"),
                    "id": $(this).data("filter-id"),
                };
                // process list
                self.list();
            });
        });
    };

    proto.setCheckboxClicks = function() {
        var self = this;
        // for each checkbox
        $(".cl-list-filter").each(function() {
            $(this).click(function() {
                var self2 = this;
                // uncheck checkbox of the same group of the checkbox
                $("input[data-checkbox-group='"+$(this).data("checkbox-group")+"']").each(function() {
                    if (this != self2) {
                        $(this).parent().removeClass("checked");
                    }
                });
                //$(self2).parent().toggleClass("checked");
                // update filter
                if ($(self2).parent().hasClass("checked")) {
                    self.filter["checkbox"][$(this).data("checkbox-group")] = $(this).data("value");
                } else {
                    delete self.filter["checkbox"][$(this).data("checkbox-group")];
                }
                self.list(); 
            });
        });
    };

    proto.list = function() {
        var self = this;
        if (self.filter.search) {
            self.filter.search = { "query": $(".cl-list-search").val() };
        }

        // display waiting
        $("#"+self.listId+" .content").addClass("hidden");
        $("#"+self.listId+" .wait").removeClass("hidden");

        $.ajax({
            url: self.url,
            dataType: 'json',
            data: {
                filter: self.filter,
                max: self.max,
            },
            success: function(params) {
                var myvar = params;
                var count = params.count;
                /*console.log("count " + count);
                console.log("max " + self.filter.max);*/
                count = Math.ceil(count / self.filter.max);
                //if(self.filter['offset'] == 0)
                    $('#page-selection').bootpag({total: count});
                self.displayList(params.items);
                //links can't wrap a div, so we have to built them
                var link;
                //for each link class
                $( ".link" ).each(function() {
                    link = $( this ).attr("href");
                    if (link != 'undefined'){
                        //we wrap the parent with the href given
                        $(this).parents(".media").wrap("<a class='clear-link' href='"+link+"'></a>");
                        $(this).parents(".in").wrap("<a class='clear-link' href='"+link+"'></a>");
                    }
                })
                $("#"+self.listId+" .wait").addClass("hidden");
                setTimeout(function() {
                    $("#"+self.listId+" .content").removeClass("hidden");
                }, 30);
                // set like links if needed
                if (self.likeManager) { 
                    self.likeManager.run(); 
                }
            }
        })
    };

    proto.displayArticles = function(events) {
        var directives = {
            postDate: {
                text: function(params) { return this.postDate; },
            },
            link: {
                href: function(params) { return this.path; },
            },
            image: {
                src: function(params) { return this.image; },
            },
            description: {
                text: function(params) { return this.description; },
            },
            title: {
                text: function(params) { return this.name; },
                href: function(params) { return this.profilPath; },
            },
            publisher: {
                text: function(params) { return this.publisherName; },
                href: function(params) { return this.publisherPath; },
            },
            more: {
                href: function(params) { return this.profilPath; },
            },
            user: {
                text: function(params) { return this.user; },
            },
            category: {
                text: function(params) { return this.category; },
            },
            urlGlobal: {
                href: function(params) { return this.profilPath; },
            },
        };
        $('#'+this.listId+' .content').render(events, directives);
    };

    return Singleton;

}(jQuery, Singleton));
