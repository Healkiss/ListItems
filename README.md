ListItems
=========

WHAT:

Allow to use jquery render easily. 

(With a bit php you can add search, filter and pagination. Js and html are provided in the library for these purposes.)

USE:

Install http://botmonster.com/jquery-bootpag/#.VBGuVmB_tcY (fixes are included in the files template.js)
Follow setup and 


SETUP:

Add an id a data-itemtype and a data-url in the main DIV
```html
<div  id="articles-list"
      data-itemtype="article" 
      data-url= "{{ path('get_articles') }}">
```

Set a data-bind in each block you want dynamic
```html
<div>
    <a data-bind='publisher'>/a>
    <em data-bind='postDate'></em>
</div>
```

Set a case in Singleton.listItems
```javascript
case "article":
  this.displayList = this.displayArticles;
  break;
```
In proto.displayArticles add a directive for each data-bind
```javascript
postDate: {
    text: function(params) { return this.postDate; },
},
publisher: {
    text: function(params) { return this.publisherName; },
    href: function(params) { return this.publisherPath; },
},
```

USE :
```javascript
entity.setTabsClicks();
entity.setSelectFilter();
entity.setCheckboxClicks();
entity.setSearch();
entity.list();
```
