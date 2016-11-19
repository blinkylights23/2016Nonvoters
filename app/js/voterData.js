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



  return `
<h1>${data.state} <span>[${data.ecv} electoral votes]</span></h1>
<dl>
  <dt>Approximate Voting Eligible Population</dt>
  <dd>${vep.toLocaleString()}</dd>
  <dt>Approximate presidential votes cast</dt>
  <dd>${votesCast.toLocaleString()}</dd>
  <dt>Approximate turnout</dt>
  <dd>${turnoutPct}%</dd>
</dl>

<table>
  <tr class="noVoteRow">
    <td>${dgaf()}</td>
    <td>${noVote.toLocaleString()}</td>
    <td>${noVotePct}%</td>
  </tr>
  <tr class="clintonRow">
    <td>Clinton</td>
    <td>${clinton.toLocaleString()}</td>
    <td>${clintonPct}%</td>
  </tr>
  <tr class="trumpRow">
    <td>Trump</td>
    <td>${trump.toLocaleString()}</td>
    <td>${trumpPct}%</td>
  </tr>
  <tr class="othersRow">
    <td>Other</td>
    <td>${others.toLocaleString()}</td>
    <td>${othersPct}%</td>
  </tr>
</table>


  `;
}
