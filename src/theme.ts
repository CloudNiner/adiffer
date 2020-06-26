import { createMuiTheme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface OsmPalette {
    created: string;
    deleted: string;
    modifiedNew: string;
    modifiedOld: string;
    modifiedTags: string;
  }

  interface Palette {
    osm: PaletteOptions["osm"];
  }

  interface PaletteOptions {
    osm: OsmPalette;
  }
}

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: "dark",
    osm: {
      created: "#faf797",
      deleted: "#ff3333",
      modifiedNew: "#90ee90",
      modifiedOld: "#8b0000",
      modifiedTags: "#608ba5",
    },
  },
});

export default theme;
