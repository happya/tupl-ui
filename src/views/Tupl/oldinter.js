import React from 'react';
import ReactTable from 'react-table-v6';         //table
import 'react-table-v6/react-table.css';         //table
import 'react-table-filter/lib/styles.css';   //table filter
import './App.css';
const Inter = props => {
    const inter_columns = [
        {
          Header: "Parent",
          accessor: "parent",
          sortable: false
        },
        {
          Header: "Child",
          accessor: "child",
          sortable: false
        },
        {
          Header: "Confidence",
          accessor: "ratio",
          filterable: false
        },
        ];
    let interTableArr=[];

    let interKey = Object.keys(props.res.results.inter_dataset_analysis);
    let interTableKey = []; // [[bc],[ac],[ab]]
    for (let i in interKey) {
      let tempKey = Object.keys(props.res.results.inter_dataset_analysis[interKey[i]]);
      interTableKey.push(tempKey);

    }
    for (let i in interKey) {
      let tempArr = [];
      for (let j in interTableKey[i]) {
        let test = props.res.results.inter_dataset_analysis[interKey[i]];
        console.log(interTableKey[i][j]);
        console.log(test[interTableKey[i][j]]);
        let temp_table =
        <div key = {j} className="BarChart">
            <p className="intra_table_filter">{interTableKey[i][j]}</p>
                  <div>
                <ReactTable
                  columns={inter_columns}
                  data={test[interTableKey[i][j]]}
                  filterable
                  defaultPageSize={10}
                  showPaginationTop

                >


                </ReactTable>

              </div>

        </div>

        tempArr.push(temp_table);
      }
      console.log(tempArr);
      let temp_table_All =
      <div key = {i}>
          <p className="tabHeader">{interKey[i]}</p>
            {tempArr}



      </div>
      interTableArr.push(temp_table_All);
    }
    return (
        interTableArr
    )
}

export default Inter;
