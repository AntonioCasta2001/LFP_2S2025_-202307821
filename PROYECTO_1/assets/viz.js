const dot = `
digraph torneo {
  "Cuartos" -> "Semifinal";
  "Semifinal" -> "Final";
  "Brasil" -> "Argentina" [label="2-1"];
}
`;
const svg = Viz(dot);
document.getElementById("diagrama").innerHTML = svg;
