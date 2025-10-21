import { Card, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-100 gap-8">
      {/* Título */}
      <h1 className="text-5xl font-bold text-green-600">CEOMG 2026</h1>

      {/* Card de inscrições com ampulheta animada */}
      <Card className="w-80 flex flex-col items-center p-6">
        <CardContent className="flex flex-col items-center gap-4">
          <Typography variant="h5" component="div">
            INSCRIÇÕES
          </Typography>

          {/* Ampulheta animada */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <HourglassEmptyIcon fontSize="large" color="primary" />
          </motion.div>
        </CardContent>
      </Card>

      {/* Botão do MUI */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => alert("A PACIÊNCIA É UMA VIRTUDE")}
      >
        Clique aqui
      </Button>
    </div>
  );
}
