ListItems
=========

WHAT:

Allow to use jquery render easily. 

(With a bit php you can add search, filter and pagination. Js and html are provided in the library for these purposes.)

USE:

If you want the pagination, install http://botmonster.com/jquery-bootpag/#.VBGuVmB_tcY (fixes are included in the files template.js)


SETUP:

Add an id, a data-itemtype and a data-url in the main DIV
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

The url need to return a Json(phpArray).

USE :
```javascript
entity.setTabsClicks(); //if you need tabs
entity.setSelectFilter(); //if you need filters
entity.setCheckboxClicks(); //if you need checkbox
entity.setSearch(); //if you need search bar
entity.list();
```
