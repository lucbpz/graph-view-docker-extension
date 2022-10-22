import { createDockerDesktopClient } from "@docker/extension-api-client";
import { QuestionAnswerOutlined } from "@mui/icons-material";
import { Box, Grid, Link, Typography } from "@mui/material";

const FEEDBACK_FORM_URL = "https://forms.gle/LQunwzgnZJ52hUjR7";
const ddClient = createDockerDesktopClient();

export function Header() {
  return (
    <Box mb={2}>
      <Grid container gap={2} alignItems="center">
        <Typography data-testid="heading" variant="h3" role="title">
          Graph View
        </Typography>
        <Link
          href="#"
          onClick={() => {
            ddClient.host.openExternal(FEEDBACK_FORM_URL);
          }}
        >
          <Typography display="inline" variant="body2">
            Give Feedback
          </Typography>
          <QuestionAnswerOutlined
            fontSize="small"
            sx={{
              verticalAlign: "bottom",
              marginLeft: "0.25em",
            }}
          />
        </Link>
      </Grid>
      <Typography
        data-testid="subheading"
        variant="body1"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        See your Docker containers, images and volumes in a network graph.
      </Typography>
    </Box>
  );
}
