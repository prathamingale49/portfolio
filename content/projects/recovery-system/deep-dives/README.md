# Recovery deep dives

Each folder maps to a card in `content/projects/recovery-system/project.json`.

To write a page:

1. Edit that folder's `article.mdx`.
2. Drop screenshots, diagrams, or exported images into the same folder.
3. Reference uploaded files with `/content/projects/recovery-system/deep-dives/<folder-name>/<file-name>`.
4. Replace the card image in `project.json` when you have a better thumbnail.

Supported rich blocks:

```mdx
<Figure
  src="/content/projects/recovery-system/deep-dives/power-architecture/power-layout.png"
  alt="Annotated power distribution layout"
  caption="The two power trees remain physically separated through conversion and deployment distribution."
/>

<MeasuredResult before="8.2 V" after="3.9 V" label="Peak 3.3 V rail transient" />

<DesignDecision title="Why use discrete voting?">
The output-enable decision remains independent of any one MCU or firmware image.
</DesignDecision>
```
