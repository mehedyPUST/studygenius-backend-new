import app from "./api";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`StudyGenius API running on port ${PORT}`);
});