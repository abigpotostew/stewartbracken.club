uuid: 123
title: Blog API
author: Stewart Bracken
date: 2020-06-08 16:24:49
tags:
---
My blog now features a RESTful API to get site, posts, tags, and other metadata about the site.


## List Posts

GET [/api/posts.json](/api/posts.json)

Get metadata about blog posts. Example:
```
{
  "total": 1,
  "pageSize": 10,
  "pageCount": 1,
  "data": [
    {
      "title": "Pure Bathing Culture",
      "slug": "Pure-Bathing-Culture",
      "date": "2020-05-28T17:48:00.000Z",
      "updated": "2020-06-08T22:38:10.817Z",
      "comments": true,
      "path": "api/articles/Pure-Bathing-Culture.json",
      "excerpt": null,
      "keywords": null,
      "cover": null,
      "content": null,
      "raw": null,
      "categories": [
        {
          "name": "Pure bathing culture",
          "path": "api/categories/Pure bathing culture.json"
        }
      ],
      "tags": [
        {
          "name": "PBC",
          "path": "api/tags/PBC.json"
        },
        {
          "name": "Luke Nemy",
          "path": "api/tags/Luke Nemy.json"
        }
      ]
    }
  ]
}
```

## List Posts by Page Number

GET [/api/posts/:PageNumber.json](/api/posts/:PageNumber.json)

Get metadata about blog posts for a page. Pagination is static. PageNumber can only be [1-N] where N equals pageCount. Example:
```
{
  "total": 1,
  "pageSize": 10,
  "pageCount": 1,
  "data": [
    {
      "title": "Pure Bathing Culture",
      "slug": "Pure-Bathing-Culture",
      "date": "2020-05-28T17:48:00.000Z",
      "updated": "2020-06-08T22:38:10.817Z",
      "comments": true,
      "path": "api/articles/Pure-Bathing-Culture.json",
      "excerpt": null,
      "keywords": null,
      "cover": null,
      "content": null,
      "raw": null,
      "categories": [
        {
          "name": "Pure bathing culture",
          "path": "api/categories/Pure bathing culture.json"
        }
      ],
      "tags": [
        {
          "name": "PBC",
          "path": "api/tags/PBC.json"
        },
        {
          "name": "Luke Nemy",
          "path": "api/tags/Luke Nemy.json"
        }
      ]
    }
  ]
}
```


## List Tags

GET [/api/tags.json](/api/tags.json)

Get metadata about tags. Example:
```
[
  {
    "name": "PBC",
    "path": "api/tags/PBC.json",
    "count": 1
  }
]
```

## Tag

GET [/api/tags/:id.json](/api/tags/:id.json)

Get metadata about a tag with name ":id". Example:
```
{
  "name": "PBC",
  "postlist": [
    {
      "title": "Pure Bathing Culture",
      "slug": "Pure-Bathing-Culture",
      "date": "2020-05-28T17:48:00.000Z",
      "updated": "2020-06-08T22:38:10.817Z",
      "comments": true,
      "path": "api/articles/Pure-Bathing-Culture.json",
      "excerpt": null,
      "keywords": null,
      "cover": null,
      "content": null,
      "raw": null,
      "categories": [
        {
          "name": "Pure bathing culture",
          "path": "api/categories/Pure bathing culture.json"
        }
      ],
      "tags": [
        {
          "name": "PBC",
          "path": "api/tags/PBC.json"
        }
      ]
    }
  ]
}
```

