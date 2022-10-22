import React, { createRef, useEffect, useLayoutEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import * as d3 from "d3";
import { Header } from "./Header";
// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

const ContainerPath =
  "m0.096756,89.295761l-0.096756,0l0,-49.84972l0.099152,0c0.371063,-2.136353 1.781738,-3.975159 3.799637,-4.871994l59.139816,-26.284332c1.701782,-0.755692 3.640442,-0.755692 5.342224,0l59.139923,26.284332c2.023102,0.896835 3.434662,2.735641 3.805786,4.871994l0.095123,0l0,0.957809l0.001312,0.080811l0.000885,0.088745c0,0.056671 -0.000885,0.113159 -0.002197,0.169556l0,48.552799l-0.096924,0c0.064026,0.367554 0.096924,0.744003 0.096924,1.125793c0,0.119537 -0.003113,0.238647 -0.009796,0.357315c-0.132904,2.457779 -1.630219,4.639114 -3.893341,5.648453l-59.139923,26.284424c-0.854218,0.374664 -1.760895,0.565308 -2.667999,0.565308c-0.91333,0 -1.820007,-0.190643 -2.674225,-0.565308l-59.139709,-26.284424c-2.210098,-0.988464 -3.691742,-3.100891 -3.877029,-5.496002c-0.013016,-0.168884 -0.019638,-0.338654 -0.019638,-0.509766c0,-0.38179 0.032974,-0.75824 0.096756,-1.125793zm118.692459,-45.018803c2.073334,-0.180969 3.783112,1.215027 3.819092,3.118103l0.760895,40.566044c0.035553,1.903107 -1.616425,3.59288 -3.689758,3.773773c-2.073334,0.180878 -3.783569,-1.215118 -3.819122,-3.118225l-0.760895,-40.566181c-0.035553,-1.903061 1.616455,-3.592529 3.689789,-3.773514zm-10.625305,7.445343c-0.036011,-1.903076 -1.745789,-3.299072 -3.819122,-3.118103c-2.073334,0.18103 -3.725342,1.870453 -3.689789,3.773376l0.760895,40.566196c0.035553,1.903107 1.745758,3.299103 3.819122,3.118225c2.073303,-0.180908 3.725311,-1.870239 3.689758,-3.773346l-0.760864,-40.566349zm-18.26355,3.105942c2.073303,-0.180893 3.783112,1.215103 3.819092,3.11821l0.760895,40.566196c0.035553,1.903107 -1.616425,3.592438 -3.689789,3.773315c-2.073303,0.180908 -3.783539,-1.215103 -3.819092,-3.11821l-0.760895,-40.566181c-0.035553,-1.903107 1.616455,-3.592438 3.689789,-3.773331zm-10.625336,10.370655c-0.03598,-1.903111 -1.745758,-3.299107 -3.819092,-3.118214c-2.073334,0.180893 -3.725342,1.870651 -3.689789,3.773777l0.760895,40.566177c0.035553,1.903107 1.745758,3.299103 3.819122,3.117767c2.073303,-0.180878 3.725311,-1.870209 3.689758,-3.773315l-0.760895,-40.566193z";
const ImagePath =
  "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z";
const VolumePath =
  "M5.51679 3.97485C5.2906 3.97485 5.07109 4.05154 4.89411 4.19238L2.07474 6.436C1.92661 6.55389 2.00996 6.7925 2.19927 6.7925H13.8007C13.99 6.7925 14.0734 6.55388 13.9253 6.436L11.1059 4.19238C10.9289 4.05154 10.7094 3.97485 10.4832 3.97485H5.51679ZM2.62677 7.3289C2.07448 7.3289 1.62677 7.77662 1.62677 8.3289V11.025C1.62677 11.5773 2.07448 12.025 2.62677 12.025H13.3733C13.9255 12.025 14.3733 11.5773 14.3733 11.025V8.3289C14.3733 7.77662 13.9255 7.3289 13.3733 7.3289H2.62677ZM12.2488 10.0129C12.6193 10.0129 12.9197 9.71249 12.9197 9.34198C12.9197 8.97147 12.6193 8.67112 12.2488 8.67112C11.8783 8.67112 11.578 8.97147 11.578 9.34198C11.578 9.71249 11.8783 10.0129 12.2488 10.0129ZM11.0189 9.34198C11.0189 9.71249 10.7186 10.0129 10.348 10.0129C9.97754 10.0129 9.67718 9.71249 9.67718 9.34198C9.67718 8.97147 9.97754 8.67112 10.348 8.67112C10.7186 8.67112 11.0189 8.97147 11.0189 9.34198Z";
const stroke = "rgba(0,0,0,.4)";
// const containerPthSvg = {
//   fill: "",
//   stroke: "rgba(0,0,0,.4)",
//   d: ContainerPath,
// }
const NODE_TYPE = {
  CONTAINER: 1,
  IMAGE: 2,
  VOLUME: 3,
};

function useDockerDesktopClient() {
  return client;
}

const VolumeDetails = ({ volume }) => {
  return (
    <Stack gap={2}>
      <Typography variant="h4">Image</Typography>
      <Grid item pt={2}>
        <Typography noWrap variant="h6">
          Name
        </Typography>
        {volume && (
          <Typography noWrap variant="body1">
            {(volume as any).Name}
          </Typography>
        )}
      </Grid>
    </Stack>
  );
};

const ImageDetails = ({ image }) => {
  return (
    <Stack gap={2}>
      <Typography variant="h4">Image</Typography>
      <Grid item pt={2}>
        <Typography noWrap variant="h6">
          Name
        </Typography>
        {image && (
          <Typography noWrap variant="body1">
            {(image as any).RepoTags[0]}
          </Typography>
        )}
      </Grid>
    </Stack>
  );
};

const ContainerDetails = ({ container }) => {
  return (
    <Stack gap={2}>
      <Typography variant="h4">Container</Typography>
      <Grid item pt={2}>
        <Typography noWrap variant="h6">
          Name
        </Typography>
        {container && (
          <Typography noWrap variant="body1">
            {(container as any).Names[0]}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Typography noWrap variant="h6">
          State
        </Typography>
        {container && (
          <Typography noWrap variant="body1">
            {(container as any).State}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Typography noWrap variant="h6">
          Status
        </Typography>
        {container && (
          <Typography noWrap variant="body1">
            {(container as any).Status}
          </Typography>
        )}
      </Grid>
      <Grid item>
        <Typography noWrap variant="h6">
          Ports
        </Typography>
        {container && (
          <Typography noWrap variant="body1">
            {(container as any).Ports.map((port) =>
              Object.keys(port)
                .map((k) => `${k}: ${port[k]}`)
                .join(", ")
            )}
          </Typography>
        )}
      </Grid>
    </Stack>
  );
};

const getColor = (status) => {
  switch (status) {
    case "running":
      return "green";
    case "paused":
      return "var(--dd-color-amber-300)";
    case "exited":
    default:
      return "var(--dd-color-grey-500)";
  }
};

const removeTagFromImg = (imgNameWithTag: string) => {
  const index = imgNameWithTag.lastIndexOf(":");
  return imgNameWithTag.slice(0, index);
};

export function App() {
  const svgRef = createRef<SVGSVGElement>();
  const ddClient = useDockerDesktopClient();
  const [data, setData] = React.useState<{ nodes; links }>();
  const [selectedNode, setSelectedNode] = React.useState<{ id; data; group }>();
  const theme = useTheme();

  const fetchAndDisplayResponse = async () => {
    const containers = await ddClient.docker.listContainers({ all: true });
    const images = await ddClient.docker.listImages();
    console.log(await ddClient.docker.cli.exec("images", []));
    // const volumes = await ddClient.extension.vm.service.get("/volumes");
    // console.log(volumes)
    const [first, ...rawVolumes] = (
      await ddClient.docker.cli.exec("volume", ["ls"])
    ).lines();
    const volumes = rawVolumes.map((line) => line.split(/\s+/));
    const volumeNames = volumes.map((item) => item[1]);

    console.log(containers);
    console.log(images);
    console.log(volumes);
    console.log(volumeNames);

    const nodes = [];
    const links = [];

    (containers as any[]).forEach((container) => {
      nodes.push({
        id: container.Names[0],
        data: container,
        group: NODE_TYPE.CONTAINER,
        color: getColor(container.State),
        radius: 20,
      });
      links.push({
        source: container.Names[0],
        target: container.ImageID,
        value: 16,
        radius: 20,
      });
      container.Mounts?.forEach((mount) => {
        if (volumeNames.find((name) => mount.Name === name)) {
          links.push({
            source: container.Names[0],
            target: mount.Name,
            value: 16,
            radius: 20,
          });
        }
      });
    });
    (images as any[]).forEach((image) => {
      nodes.push({
        id: image.Id,
        name: removeTagFromImg(image.RepoTags[0]),
        data: image,
        group: NODE_TYPE.IMAGE,
        radius: 20,
      });
    });
    for (const volumeName of volumeNames) {
      nodes.push({
        id: volumeName,
        data: (
          await ddClient.docker.cli.exec("volume inspect", [volumeName])
        ).parseJsonObject()[0],
        group: NODE_TYPE.VOLUME,
        radius: 20,
      });
    }
    // volumeNames.forEach(async (volumeName) => {
    //   nodes.push({
    //     id: volumeName,
    //     data: await ddClient.docker.cli.exec('volume inspect', [volumeName]),
    //     group: NODE_TYPE.VOLUME,
    //     radius: 20,
    //   });
    // });
    setData({ nodes, links });
  };

  useEffect(() => {
    fetchAndDisplayResponse();
  }, []);

  useEffect(() => {
    if (svgRef.current && data) {
      var svg = d3.select(svgRef.current),
        width = svg.attr("width"),
        height = svg.attr("height");

      svg.selectAll("*").remove();
      const innerSvg = svg.append("g");

      svg.call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([0.5, 3])
          .on("zoom", zoomed)
      );
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      function zoomed() {
        console.log(d3.event);
        innerSvg.attr("transform", d3.event.transform);
        // svg.attr("transform", "scale(" + d3.event.transform.k + ")");
      }

      // var simulation = d3
      //   .forceSimulation()
      //   .force(
      //     "link",
      //     d3
      //       .forceLink()
      //       .id(function (d) {
      //         return d.id;
      //       })
      //       .distance(50)
      //   )
      //   .force("charge", d3.forceManyBody().strength(0))
      //   .force("center", d3.forceCenter(width / 2, height / 2))
      //   .force(
      //     "collision",
      //     d3.forceCollide().radius(function (d) {
      //       return d.radius || '20';
      //     })
      //   );

      var simulation = d3
        .forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.2))
        .force("y", d3.forceY(height / 2).strength(0.3))
        .force("charge", d3.forceManyBody().strength(-2000))
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(100)
        )
        .force(
          "collide",
          d3.forceCollide().radius((d) => d.radius)
        );

      var link = innerSvg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke", "lightblue")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        });

      var node = innerSvg
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter()
        .append("g")
        // .html((node => {
        //   console.log(node);
        //   return (<div>{node.data.Id}</div>)
        // }))
        .attr("class", function (d) {
          return `group-${d.group}`;
        });

      // .append('foreignobject')
      // .enter()
      // .append('div')
      // .enter()
      // .append('hola')
      const nodeDivs = node
        .append("foreignObject")
        .attr("width", "60px")
        .attr("height", "60px")
        .attr("x", -15)
        .attr("y", -15)
        .append("xhtml:div")
        .attr("class", "node-div")
        .style("height", "100%")
        .style("width", "100%")
        .style('border-radius', '4px')
        .style("border", "1px solid var(--dd-color-grey-500)")
        .style("background-color", "var(--dd-color-background)")
        .style("display", "grid")
        .style("place-items", "center");

      nodeDivs
        .append("svg")
        .attr("width", "15px")
        .attr("height", "15px")
        .attr("viewBox", "0 0 15 15")
        .append("path")
        .attr("d", (d) => {
          if (d.group === NODE_TYPE.IMAGE) return ImagePath;
          else if (d.group === NODE_TYPE.CONTAINER) return ContainerPath;
          else return VolumePath;
        })
        .style("stroke", stroke)
        .attr("fill", function (d) {
          if (d.color) return d.color;
          return color(d.group);
        });

        nodeDivs.append('p').attr('style', 'width: 60px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; text-align: center; font-size: 8px; margin-bottom: 0').text(node => node.name || node.id)
        nodeDivs.append('p').attr('style', 'width: 60px; text-align: center; color: var(--dd-color-grey-500); font-size: 8px; margin-top: 0').text(node => {
          // if (node.group === NODE_TYPE.IMAGE) console.log(node)
          if (node.group === NODE_TYPE.IMAGE) return node.data.RepoTags[0].split(':')[1];
          if (node.group === NODE_TYPE.CONTAINER) return node.data.Ports && node.data.Ports.length ? 'Ports: '+node.data.Ports.map(p => p.PrivatePort).join(',') : 'no ports'
        })
      // .html((node) => `<p style="font-size: '10px'">${node.name || node.id}</p>`)
      // .append("xhtml:object")
      // .attr('height','100%').attr('width','100%')
      // .attr('type','image/svg+xml')
      // .attr('data','http://upload.wikimedia.org/wikipedia/commons/8/84/Konqi_svg.svg')
      // .append("p")
      // .attr("innerText", "hola");
      // .append('img').attr('alt','notloaded');
      // g4.append('path').attr('d', upTri()).attr('fill', 'green');

      // svg
      //   .selectAll("g.group-1")
      //   .append("path")
      //   .attr("d", ContainerPath)
      //   .style("stroke", stroke)
      //   .attr("fill", function (d) {
      //     if (d.color) return d.color;
      //     return color(d.group);
      //   });

      // // images
      // svg
      //   .selectAll("g.group-2")
      //   .append("path")
      //   .attr("d", ImagePath)
      //   .style("stroke", stroke)
      //   .attr("fill", function (d) {
      //     if (d.color) return d.color;
      //     return color(d.group);
      //   });

      // svg
      //   .selectAll("g.group-3")
      //   .append("path")
      //   .attr("d", VolumePath)
      //   .style("stroke", stroke)
      //   .attr("fill", function (d) {
      //     if (d.color) return d.color;
      //     return color(d.group);
      //   });

      // .attr("d", upTri())
      // .attr("transform", function(d){return 'translate(-25, -25)'});
      // .style("stroke", "lightblue")
      // .style("fill", "black")
      var nodeImages = svg.selectAll("g.group-2");

      // var circles = nodeImages
      //   .append("circle")
      //   .attr("r", 5)
      //   .attr("fill", function (d) {
      //     if (d.color) return d.color;
      //     return color(d.group);
      //   });
      // .attr("fill", function(d) { return color(d.group); });

      node.on("click", onclick);
      node.on("hover", onhover);

      // Create a drag handler and append it to the node object instead
      var drag_handler = d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

      drag_handler(node);

      function onhover(d) {
        d.append("text", d.name || d.id);
      }

      // var lables = node.append("text")
      //     .text(function(d) {
      //       return d.id;
      //     })
      //     .attr('x', 6)
      //     .attr('y', 3);

      node.append("title").text(function (d) {
        return d.name || d.id;
      });

      simulation.nodes(data.nodes).on("tick", ticked);

      simulation.force("link").links(data.links);

      function ticked() {
        link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node.attr("transform", function (d) {
          if (d.group === NODE_TYPE.IMAGE)
            return "translate(" + (d.x - 16) + "," + (d.y - 16) + ")";
          if (d.group === NODE_TYPE.VOLUME)
            return "translate(" + (d.x - 12) + "," + (d.y - 12) + ")";
          return "translate(" + (d.x - 13) + "," + (d.y - 12) + ")";
        });
      }
      // });

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.05).restart();
        d.fx = d.x;
        d.fy = d.y;
        svg.attr("cursor", "grabbing");
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        svg.attr("cursor", "grab");
      }

      function onclick(d) {
        setSelectedNode(d);
        console.log(d);
      }
    }
  }, [data]);
  
  let width = 900;
  let height = 600;
  useLayoutEffect(() => {
    const graph = document.querySelector('#graph') as any;
    if (graph && graph.style) graph.style.width = 'calc(100vw - 64px)'
    if (graph && graph.style) graph.style.height = 'calc(100vh - 128px)'
  }, []);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item sx={{ backgroundColor: theme.palette.docker.grey[100] }}>
          <svg id="graph" ref={svgRef} width={width} height={height}></svg>
        </Grid>
        {selectedNode && (
          <Card
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              minWidth: 275,
            }}
          >
            <CardContent>
              {selectedNode.group === NODE_TYPE.CONTAINER && (
                <ContainerDetails container={selectedNode.data} />
              )}
              {selectedNode.group === NODE_TYPE.IMAGE && (
                <ImageDetails image={selectedNode.data} />
              )}
              {selectedNode.group === NODE_TYPE.VOLUME && (
                <VolumeDetails volume={selectedNode.data} />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelectedNode(undefined)}>
                Close
              </Button>
            </CardActions>
          </Card>
        )}
      </Grid>
    </>
  );
}
