'use strict';


function dgaf() {
  var dgafs = [
    '¯\\_(ツ)_/¯',
    'DGAF',
    '&ldquo;Shit! Was that today?&rdquo;',
    '&ldquo;Whatver, y\'all decide.&rdquo;'
  ];
  return dgafs[Math.floor(Math.random() * dgafs.length)];
}



export default function(data) {
  var clinton = parseInt(data.clinton),
      trump = parseInt(data.trump),
      others = parseInt(data.others),
      vep = parseInt(data.vep),
      votesCast = (clinton + trump + others),
      noVote = vep - votesCast,
      turnoutPct = ((clinton + trump + others) / parseFloat(data.vep) * 100).toFixed(2),
      noVotePct = (100 * noVote / vep).toFixed(2),
      clintonPct = (100 * clinton / vep).toFixed(2),
      trumpPct = (100 * trump / vep).toFixed(2),
      othersPct = (100 * others / vep).toFixed(2);

  var resultTable = [
    {
      rowClass: 'noVoteRow',
      title: dgaf(),
      total: noVote,
      pct: noVotePct
    },
    {
      rowClass: 'clintonRow',
      title: 'Clinton',
      total: clinton,
      pct: clintonPct
    },
    {
      rowClass: 'trumpRow',
      title: 'Trump',
      total: trump,
      pct: trumpPct
    },
    {
      rowClass: 'othersRow',
      title: 'Others',
      total: others,
      pct: othersPct
    },
  ];

  resultTable.sort((a, b) => {
    return b.total - a.total;
  });

  return `
<h1>${data.state} <span>[${data.ecv} electoral votes]</span></h1>

<table>
  <tr class="${resultTable[0].rowClass}">
    <td>${resultTable[0].title}</td>
    <td>${resultTable[0].total.toLocaleString()}</td>
    <td>${resultTable[0].pct.toLocaleString()}%</td>
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
