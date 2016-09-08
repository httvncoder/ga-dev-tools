import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table-2';

/**
 * Parses the response from the API and generates the pivot table.
 * @param {Object} report An Analytics Reporting API V4 Request Report object.
 * @returns {Object} A pivot table object.
 */
export function createPivotData(report) {
  if (!report.data.rows) {
    return;
  }

  let headers = [];
  let pivotTable = [];

  let columnHeader = report.columnHeader;

  if (columnHeader.dimensions && columnHeader.dimensions.length) {

    headers = headers.concat(columnHeader.dimensions);
  }

  let metricHeaderEntries = columnHeader.metricHeader.metricHeaderEntries;
  for (let entry of metricHeaderEntries) {
    headers.push(entry.name);
  }

  if (columnHeader.metricHeader.pivotHeaders &&
      columnHeader.metricHeader.pivotHeaders.length) {
    let pivotHeader = columnHeader.metricHeader.pivotHeaders[0];
    let pivotHeaderEntries = pivotHeader.pivotHeaderEntries;
    for (let entry of pivotHeaderEntries) {
      let header = '';
      for (let j=0, dimension; dimension = entry.dimensionNames[j]; ++j) {
        let value = entry.dimensionValues[j];
        header += dimension + '=' + value + ' ';
      }
      header += entry.metric.name;
      headers.push(header);
    }
  }

  if (report.data.rows && report.data.rows.length) {
    for (let rowIndex=0, row; row = report.data.rows[rowIndex]; ++rowIndex) {
      let pivotTableRow = {};
      let headerIndex = 0;
      for (let value of row.dimensions) {
        pivotTableRow[headers[headerIndex]] = value;
        headerIndex += 1;
      }
      let metricValues = row.metrics[0].values;
      for (let value of metricValues) {
        pivotTableRow[headers[headerIndex]] = value;
        headerIndex += 1;
      }
      if (row.metrics[0].pivotValueRegions &&
          row.metrics[0].pivotValueRegions.length) {
        let pivotValues = row.metrics[0].pivotValueRegions[0].values;
        for (let value of pivotValues) {
          pivotTableRow[headers[headerIndex]] = value;
          headerIndex += 1;
        }
      }
      pivotTable.push(pivotTableRow);
    }
  }

  return {
      pivotTable: pivotTable,
      headers: headers
  };
}

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

export default class PivotTable extends React.Component {

  /**
   * @constructor
   * @param {Object} props The props object initially passed by React.
   */
  constructor(props) {
    super(props);
  }

  /** @return {Object} */
  render() {

    let {response} = this.props;

    let data = createPivotData(response.result.reports[0]);

    if (data) {
      return (
        <Table
          rowsCount={data.pivotTable.length}
          rowHeight={50}
          headerHeight={100}
          width={1000}
          height={500}>
          {data.headers.map((header) => (
            <Column
              header={<Cell>{header}</Cell>}
              key={header}
              cell={<TextCell data={data.pivotTable} col={header} />}
              width={150}
            />
          ))}
        </Table>
      );
    } else {
      return (
          <h2>No data in response</h2>
      );
    }
  }
}