'use strict';


function dgaf() {
  var dgafs = [
    '¯\\_(ツ)_/¯',
    // 'DGAF',
    // '&ldquo;Shit! Was that today?&rdquo;',
    // '&ldquo;Whatver, y\'all decide.&rdquo;'
  ];
  return dgafs[Math.floor(Math.random() * dgafs.length)];
}



export default function(data) {
  var resultTable = [
    {
      rowClass: 'noVoteRow',
      title: dgaf(),
      total: data.noVote,
      pct: data.noVotePct
    },
    {
      rowClass: 'clintonRow',
      title: 'Clinton',
      total: data.clinton,
      pct: data.clintonPct
    },
    {
      rowClass: 'trumpRow',
      title: 'Trump',
      total: data.trump,
      pct: data.trumpPct
    },
    {
      rowClass: 'othersRow',
      title: 'Others',
      total: data.others,
      pct: data.othersPct
    }
  ];

  resultTable.sort((a, b) => {
    return b.total - a.total;
  });

  return `
<h1>${data.state}</h1>
<h2>
  <span>${data.ecv}</span> electoral votes<br/>
  <span>${data.vep.toLocaleString()}</span> eligible voters<br/>
  <span>${data.turnoutPct}</span>% turnout
</h2>

<table>
  <tr class="${resultTable[0].rowClass}">
    <td>${resultTable[0].title}</td>
    <td>${resultTable[0].total.toLocaleString()}</td>
    <td>${resultTable[0].pct.toLocaleString()}%</td>
    <td rowspan="4" class="pieCell">
      <svg id="pieChart"></svg>
    </td>
  </tr>
  <tr class="${resultTable[1].rowClass}">
    <td>${resultTable[1].title}</td>
    <td>${resultTable[1].total.toLocaleString()}</td>
    <td>${resultTable[1].pct.toLocaleString()}%</td>
  </tr>
  <tr class="${resultTable[2].rowClass}">
    <td>${resultTable[2].title}</td>
    <td>${resultTable[2].total.toLocaleString()}</td>
    <td>${resultTable[2].pct.toLocaleString()}%</td>
  </tr>
  <tr class="${resultTable[3].rowClass}">
    <td>${resultTable[3].title}</td>
    <td>${resultTable[3].total.toLocaleString()}</td>
    <td>${resultTable[3].pct.toLocaleString()}%</td>
  </tr>
</table>


  `;
}
