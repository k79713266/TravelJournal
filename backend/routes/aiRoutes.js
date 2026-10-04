const express = require("express");

const router = express.Router();

router.post("/generate-story", async (req, res) => {
  try {
    const { destination, startDate, endDate, story } = req.body;

    const generatedStory = `
My journey to ${destination} was a memorable experience.

I travelled from ${startDate} to ${endDate}. ${story}

The trip gave me a chance to explore a new place, enjoy the journey,
and create beautiful memories. Every moment made the experience
special and worth remembering.

Overall, my trip to ${destination} was enjoyable and became a
wonderful memory that I would love to remember for a long time.
`;

    res.json({
      story: generatedStory.trim(),
    });

  } catch (error) {
    console.error("Story Generation Error:", error);

    res.status(500).json({
      message: "Story generate nahi ho paayi.",
    });
  }
});

module.exports = router;