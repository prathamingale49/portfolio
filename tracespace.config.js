module.exports = {
  layer: {
    "PCB0_Copper_Signal_Top.gbr": { type: "copper", side: "top" },
    "PCB0_Pads_Top.gbr": { type: "copper", side: "top" },
    "PCB0_Soldermask_Top.gbr": { type: "soldermask", side: "top" },
    "PCB0_Legend_Top.gbr": { type: "silkscreen", side: "top" },
    "PCB0_Paste_Top.gbr": { type: "solderpaste", side: "top" },
    "PCB0_Copper_Signal_Bot.gbr": { type: "copper", side: "bottom" },
    "PCB0_Pads_Bot.gbr": { type: "copper", side: "bottom" },
    "PCB0_Soldermask_Bot.gbr": { type: "soldermask", side: "bottom" },
    "PCB0_Legend_Bot.gbr": { type: "silkscreen", side: "bottom" },
    "PCB0_Paste_Bot.gbr": { type: "solderpaste", side: "bottom" },
    "PCB0_Copper_Signal_1.gbr": { type: "copper", side: "inner" },
    "PCB0_Copper_Signal_2.gbr": { type: "copper", side: "inner" },
    "PCB0_Copper_Signal_3.gbr": { type: "copper", side: "inner" },
    "PCB0_Copper_Signal_4.gbr": { type: "copper", side: "inner" },
    "PCB0_Profile.gbr": { type: "outline", side: "all" },
    "PCB0.DRL": { type: "drill", side: "all" },
    "PCB0.TXT": { type: "drill", side: "all" }
  },
  board: {
    color: {
      fr4: "rgba(13, 49, 38, 1)",
      cu: "rgba(212, 138, 58, 1)",
      cf: "rgba(212, 138, 58, 0.55)",
      sm: "rgba(37, 183, 127, 0.78)",
      ss: "rgba(231, 237, 245, 0.92)",
      sp: "rgba(202, 213, 225, 0.45)"
    }
  }
};
