// Copyright 2015 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


import React from 'react';

const REQUEST_URI = 'POST https://analyticsreporting.googleapis.com/v4/reports:batchGet?'

const DEFAULT_REQUEST =

{
  "reportRequests": 
  [
    {
      "dateRanges": 
      [
        {
          "startDate": "2015-01-01",
          "endDate": "2015-02-01"
        }
      ],
      "viewId": "1174",
      "dimensions": [],
      "metrics": 
      [
        {
          "expression": "ga:sessions"
        }
      ],
      "orderBys": 
      [
        {
          "fieldName": "ga:sessionCount",
          "orderType": "HISTOGRAM_BUCKET"
        }
      ]
    }
  ]
}


function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

export default class RequestViewer extends React.Component {

  handleChange = () => {
    console.log(this);
  }

  composeRequest = () => {
    let {params} = this.props;
    console.log(params);
    
    var template = DEFAULT_REQUEST;
    template.reportRequests[0].viewId = params.viewId;
    template.reportRequests[0].dateRanges[0].startDate = params.startDate;
    template.reportRequests[0].dateRanges[0].endDate = params.endDate;

    if (params.dimensions) {
      let dimensions = params.dimensions.split(',');
      template.reportRequests[0].dimensions = [];
      for (var i in dimensions) {
        template.reportRequests[0].dimensions.push({'name': dimensions[i]});
      }
    } else {
      delete template.reportRequests[0].dimensions;
    }


    //var request = REQUEST_URI + '\n'
    var request = syntaxHighlight(JSON.stringify(template, null, 2));
    return request;
  }

  render() {

    let request = this.composeRequest();


    return (
      <div>
        <h3> JSON request</h3>
        <pre
          cols="80"
          rows="20"
          id="query-output"
          onChange={this.handleChange}
          dangerouslySetInnerHTML={{__html: request}}>
        </pre>
      </div>
    );
  }
}