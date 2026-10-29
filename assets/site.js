// Open Eyes website: draws the illustrated people and runs the editor demo on the home page.
// Plain script, no dependencies, no network requests.

(function () {
  "use strict";

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

  const hairShapes = {
    curls: {
      back: "",
      front: "M-58 2 Q-66 -66 0 -68 Q66 -66 58 2 Q52 -34 0 -40 Q-52 -34 -58 2Z",
    },
    bob: {
      back: "M-64 62 Q-74 -46 0 -68 Q74 -46 64 62Z",
      front: "M-58 -2 Q-60 -68 0 -70 Q60 -68 58 -2 Q42 -48 0 -46 Q-30 -46 -58 -2Z",
    },
    short: {
      back: "",
      front: "M-56 -10 Q-54 -66 0 -64 Q54 -66 56 -10 Q36 -42 0 -44 Q-36 -42 -56 -10Z",
    },
    bun: {
      back: "M-22 -64 a22 20 0 1 1 44 0Z",
      front: "M-57 -4 Q-58 -66 0 -66 Q58 -66 57 -4 Q46 -40 0 -44 Q-46 -40 -57 -4Z",
    },
  };

  /** One illustrated person as SVG markup, centered on their face at (x, y). */
  function personMarkup(person) {
    const hair = hairShapes[person.hairStyle];
    const stateClasses = [
      "person",
      person.blinking ? "is-blinking" : "",
      person.notSmiling ? "is-not-smiling" : "",
    ].join(" ");
    const rotation = person.tilt ? ` rotate(${person.tilt})` : "";
    return `
      <g class="${stateClasses}" data-person="${person.id || ""}" transform="translate(${person.x} ${person.y}) scale(${person.scale || 1})${rotation}">
        <path d="M-84 240 Q-84 92 0 84 Q84 92 84 240Z" fill="${person.shirt}"/>
        <rect x="-16" y="40" width="32" height="52" rx="10" fill="${person.skinShade}"/>
        ${hair.back ? `<path d="${hair.back}" fill="${person.hair}"/>` : ""}
        <circle cx="-55" cy="8" r="10" fill="${person.skinShade}"/>
        <circle cx="55" cy="8" r="10" fill="${person.skinShade}"/>
        <circle r="56" fill="${person.skin}"/>
        <path d="${hair.front}" fill="${person.hair}"/>
        <path d="M-31 -18 Q-20 -25 -9 -18 M9 -18 Q20 -25 31 -18" stroke="${person.hair}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="eyes-open">
          <ellipse cx="-20" cy="-2" rx="9.5" ry="7.5" fill="#fff"/>
          <ellipse cx="20" cy="-2" rx="9.5" ry="7.5" fill="#fff"/>
          <circle cx="-19" cy="-1" r="5" fill="#26201d"/>
          <circle cx="21" cy="-1" r="5" fill="#26201d"/>
        </g>
        <path class="eyes-closed" d="M-30 -1 Q-20 7 -10 -1 M10 -1 Q20 7 30 -1" stroke="#26201d" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M1 4 Q7 16 -2 20" stroke="${person.skinShade}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path class="mouth-smile" d="M-19 29 Q0 50 19 29 Q0 37 -19 29Z" fill="#8a3434"/>
        <path class="mouth-flat" d="M-13 34 L13 34" stroke="#8a3434" stroke-width="4" stroke-linecap="round"/>
        ${person.glasses ? `<g stroke="#2a2f3a" stroke-width="3" fill="none"><circle cx="-20" cy="-2" r="15"/><circle cx="20" cy="-2" r="15"/><path d="M-5 -3 Q0 -7 5 -3"/></g>` : ""}
      </g>`;
  }

  function sceneMarkup(viewBox, people, backgroundId) {
    return `
      <svg xmlns="${SVG_NAMESPACE}" viewBox="${viewBox}" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="${backgroundId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#a9cdee"/>
            <stop offset="1" stop-color="#e6f0f8"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#${backgroundId})"/>
        <circle cx="86%" cy="18%" r="34" fill="#fff6cf"/>
        <path d="M0 330 Q150 250 300 300 T600 280 V400 H0Z" fill="#9fcaa6"/>
        <path d="M0 360 Q200 310 400 350 T700 330 V420 H0Z" fill="#7fb48d"/>
        ${people.map(personMarkup).join("")}
      </svg>`;
  }

  // ---- Demo wording per page language (document.documentElement.lang) ---------------------------

  const demoStringsByLanguage = {
    en: {
      shotCaption: (shotNumber) => `Shot ${shotNumber}`,
      favoriteSuffix: " (the photo to fix)",
      faceName: (faceNumber) => `Face ${faceNumber}`,
      faceFixed: (faceName) => `${faceName}, fixed`,
      faceImprovable: (faceName) => `${faceName}, can look better`,
      hintOneImprovable: "One face can look better. Tap the highlighted face.",
      hintManyImprovable: (count) => `${count} faces can look better. Tap a highlighted face.`,
      hintAllGood: "Looking good. Tap Save copy when you're done.",
      hintStart: "Tap a face to change its eyes or smile.",
      asIs: "As is",
      shotOption: (shotNumber) => `Shot ${shotNumber}`,
      best: "Best",
      useBestShots: "Use the best shots",
      eyes: "Eyes",
      eyesHelp: "Pick the shot where the eyes look best.",
      smile: "Smile",
      smileHelp: "Pick the shot with the nicest smile.",
      undo: "Undo",
      done: "Done",
    },
    de: {
      shotCaption: (shotNumber) => `Aufnahme ${shotNumber}`,
      favoriteSuffix: " (das Foto zum Korrigieren)",
      faceName: (faceNumber) => `Gesicht ${faceNumber}`,
      faceFixed: (faceName) => `${faceName}, korrigiert`,
      faceImprovable: (faceName) => `${faceName}, geht noch besser`,
      hintOneImprovable: "Ein Gesicht geht noch besser. Tippe auf das markierte Gesicht.",
      hintManyImprovable: (count) => `${count} Gesichter gehen noch besser. Tippe auf ein markiertes Gesicht.`,
      hintAllGood: "Sieht gut aus. Tippe auf „Kopie speichern“, wenn du fertig bist.",
      hintStart: "Tippe auf ein Gesicht, um Augen oder Lächeln zu ändern.",
      asIs: "Unverändert",
      shotOption: (shotNumber) => `Aufnahme ${shotNumber}`,
      best: "Beste",
      useBestShots: "Beste Aufnahmen verwenden",
      eyes: "Augen",
      eyesHelp: "Wähle die Aufnahme, in der die Augen am besten aussehen.",
      smile: "Lächeln",
      smileHelp: "Wähle die Aufnahme mit dem schönsten Lächeln.",
      undo: "Rückgängig",
      done: "Fertig",
    },
  };

  const pageLanguage = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const demoStrings = demoStringsByLanguage[pageLanguage] || demoStringsByLanguage.en;

  // ---- The three shots of the demo, and who blinks or doesn't smile in each --------------------

  const demoPeople = [
    { id: "a", x: 150, y: 196, scale: 0.98, skin: "#8d5a3b", skinShade: "#764a30", hair: "#241812", hairStyle: "curls", shirt: "#e4572e" },
    { id: "b", x: 300, y: 178, scale: 1.04, skin: "#f1c7a3", skinShade: "#ddb08b", hair: "#b97a35", hairStyle: "bob", shirt: "#3b8ea5" },
    { id: "c", x: 450, y: 200, scale: 0.96, skin: "#d9a27b", skinShade: "#c08b66", hair: "#9aa0a8", hairStyle: "short", shirt: "#f2b134", glasses: true },
  ];

  const shots = {
    1: { blinking: ["b"], notSmiling: ["c"] },
    2: { blinking: [], notSmiling: ["c"] },
    3: { blinking: ["a"], notSmiling: [] },
  };
  const favoriteShot = 1;
  const suggestions = { a: { eyes: 1, mouth: 1 }, b: { eyes: 2, mouth: 1 }, c: { eyes: 1, mouth: 3 } };

  // Face boxes over the 600x400 photo, in percent, matching demoPeople positions.
  const faceBoxes = {
    a: { left: 14, top: 31, width: 22, height: 33 },
    b: { left: 38.5, top: 25.5, width: 23, height: 35 },
    c: { left: 64.5, top: 32.5, width: 21, height: 32 },
  };

  function shotPeople(shotNumber) {
    const shot = shots[shotNumber];
    return demoPeople.map((person) => ({
      ...person,
      blinking: shot.blinking.includes(person.id),
      notSmiling: shot.notSmiling.includes(person.id),
    }));
  }

  function setUpDemo(demoElement) {
    const photoElement = demoElement.querySelector(".demo-photo");
    const hintElement = demoElement.querySelector(".demo-hint");
    const sheetElement = demoElement.querySelector(".demo-sheet");
    const stripElement = demoElement.querySelector(".demo-strip");

    photoElement.insertAdjacentHTML("afterbegin", sceneMarkup("0 0 600 400", shotPeople(favoriteShot), "demo-sky"));
    const photoSvg = photoElement.querySelector("svg");

    [1, 2, 3].forEach((shotNumber) => {
      const figure = document.createElement("figure");
      if (shotNumber === favoriteShot) figure.className = "is-favorite";
      figure.innerHTML = sceneMarkup("0 0 600 400", shotPeople(shotNumber), `strip-sky-${shotNumber}`) +
        `<figcaption>${demoStrings.shotCaption(shotNumber)}${shotNumber === favoriteShot ? demoStrings.favoriteSuffix : ""}</figcaption>`;
      stripElement.appendChild(figure);
    });

    /** personId -> { eyes?: shot, mouth?: shot }; a missing entry keeps the favorite ("As is"). */
    let picks = {};
    let undoStacks = {};
    let selectedPersonId = null;

    const faceButtons = {};
    demoPeople.forEach((person, personPosition) => {
      const faceButton = document.createElement("button");
      faceButton.type = "button";
      faceButton.className = "demo-face";
      const box = faceBoxes[person.id];
      Object.assign(faceButton.style, { left: box.left + "%", top: box.top + "%", width: box.width + "%", height: box.height + "%" });
      faceButton.innerHTML = `
        <span class="badge" aria-hidden="true">
          <svg class="badge-improvable" viewBox="0 0 24 24"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z" fill="currentColor"/></svg>
          <svg class="badge-fixed" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg>
        </span>`;
      faceButton.dataset.faceNumber = String(personPosition + 1);
      faceButton.addEventListener("click", () => openSheet(person.id));
      photoElement.appendChild(faceButton);
      faceButtons[person.id] = faceButton;
    });

    function personPicks(personId) {
      return picks[personId] || {};
    }

    function hasSuggestion(personId) {
      return suggestions[personId].eyes !== favoriteShot || suggestions[personId].mouth !== favoriteShot;
    }

    function isFixed(personId) {
      return Object.keys(personPicks(personId)).length > 0;
    }

    function improvablePersonIds() {
      return demoPeople.map((person) => person.id).filter((personId) => hasSuggestion(personId) && !isFixed(personId));
    }

    function render() {
      demoPeople.forEach((person, personPosition) => {
        const eyesShot = personPicks(person.id).eyes || favoriteShot;
        const mouthShot = personPicks(person.id).mouth || favoriteShot;
        const personGroup = photoSvg.querySelector(`[data-person="${person.id}"]`);
        personGroup.classList.toggle("is-blinking", shots[eyesShot].blinking.includes(person.id));
        personGroup.classList.toggle("is-not-smiling", shots[mouthShot].notSmiling.includes(person.id));

        const faceButton = faceButtons[person.id];
        const fixed = isFixed(person.id);
        const improvable = !fixed && hasSuggestion(person.id);
        faceButton.classList.toggle("is-fixed", fixed);
        faceButton.classList.toggle("is-improvable", improvable);
        faceButton.classList.toggle("is-selected", selectedPersonId === person.id);
        const faceName = demoStrings.faceName(personPosition + 1);
        faceButton.setAttribute("aria-label", fixed ? demoStrings.faceFixed(faceName) : improvable ? demoStrings.faceImprovable(faceName) : faceName);
      });

      const improvableCount = improvablePersonIds().length;
      const anyFixes = demoPeople.some((person) => isFixed(person.id));
      if (improvableCount === 1) hintElement.textContent = demoStrings.hintOneImprovable;
      else if (improvableCount > 1) hintElement.textContent = demoStrings.hintManyImprovable(improvableCount);
      else if (anyFixes) hintElement.textContent = demoStrings.hintAllGood;
      else hintElement.textContent = demoStrings.hintStart;

      renderSheet();
    }

    function renderSheet() {
      if (!selectedPersonId) {
        sheetElement.hidden = true;
        return;
      }
      sheetElement.hidden = false;
      const personPosition = demoPeople.findIndex((person) => person.id === selectedPersonId);
      const suggestion = suggestions[selectedPersonId];
      const currentPicks = personPicks(selectedPersonId);
      const bestAlreadyUsed = (currentPicks.eyes || favoriteShot) === suggestion.eyes &&
        (currentPicks.mouth || favoriteShot) === suggestion.mouth;

      const optionsMarkup = (region) => [1, 2, 3].map((shotNumber) => {
        const isPicked = (currentPicks[region] || favoriteShot) === shotNumber;
        const isBest = suggestion[region] === shotNumber && shotNumber !== favoriteShot;
        const label = shotNumber === favoriteShot ? demoStrings.asIs : demoStrings.shotOption(shotNumber);
        return `<button type="button" class="demo-option" data-region="${region}" data-shot="${shotNumber}" aria-pressed="${isPicked}">` +
          `${isBest ? `<span class="best">${demoStrings.best}</span>` : ""}${label}</button>`;
      }).join("");

      sheetElement.innerHTML = `
        <h3>${demoStrings.faceName(personPosition + 1)}</h3>
        ${hasSuggestion(selectedPersonId) ? `<button type="button" class="button" data-action="best" ${bestAlreadyUsed ? "disabled" : ""}>${demoStrings.useBestShots}</button>` : ""}
        <p class="region-label">${demoStrings.eyes}</p>
        <p class="region-help">${demoStrings.eyesHelp}</p>
        <div class="demo-options">${optionsMarkup("eyes")}</div>
        <p class="region-label">${demoStrings.smile}</p>
        <p class="region-help">${demoStrings.smileHelp}</p>
        <div class="demo-options">${optionsMarkup("mouth")}</div>
        <div class="demo-actions">
          <button type="button" class="text-button" data-action="undo" ${(undoStacks[selectedPersonId] || []).length ? "" : "disabled"}>${demoStrings.undo}</button>
          <button type="button" class="text-button" data-action="done">${demoStrings.done}</button>
        </div>`;
    }

    function rememberForUndo(personId) {
      (undoStacks[personId] = undoStacks[personId] || []).push({ ...personPicks(personId) });
    }

    function setPicks(personId, updatedPicks) {
      const cleanedPicks = {};
      Object.entries(updatedPicks).forEach(([region, shotNumber]) => {
        if (shotNumber !== favoriteShot) cleanedPicks[region] = shotNumber;
      });
      if (Object.keys(cleanedPicks).length) picks[personId] = cleanedPicks;
      else delete picks[personId];
    }

    function openSheet(personId) {
      selectedPersonId = personId;
      render();
      const firstControl = sheetElement.querySelector("button:not([disabled])");
      if (firstControl) firstControl.focus({ preventScroll: true });
    }

    sheetElement.addEventListener("click", (clickEvent) => {
      const target = clickEvent.target.closest("button");
      if (!target || !selectedPersonId) return;
      const personId = selectedPersonId;
      if (target.dataset.action === "best") {
        rememberForUndo(personId);
        setPicks(personId, { ...personPicks(personId), eyes: suggestions[personId].eyes, mouth: suggestions[personId].mouth });
      } else if (target.dataset.action === "undo") {
        const previousPicks = (undoStacks[personId] || []).pop();
        if (previousPicks) setPicks(personId, previousPicks);
      } else if (target.dataset.action === "done") {
        selectedPersonId = null;
        render();
        faceButtons[personId].focus({ preventScroll: true });
        return;
      } else if (target.dataset.region) {
        const shotNumber = Number(target.dataset.shot);
        if ((personPicks(personId)[target.dataset.region] || favoriteShot) === shotNumber) return;
        rememberForUndo(personId);
        setPicks(personId, { ...personPicks(personId), [target.dataset.region]: shotNumber });
      }
      const focusedRegion = target.dataset.region;
      const focusedShot = target.dataset.shot;
      const focusedAction = target.dataset.action;
      render();
      const refocusSelector = focusedRegion
        ? `[data-region="${focusedRegion}"][data-shot="${focusedShot}"]`
        : `[data-action="${focusedAction}"]`;
      const refocusTarget = sheetElement.querySelector(refocusSelector + ":not([disabled])") || sheetElement.querySelector("[data-action='done']");
      if (refocusTarget) refocusTarget.focus({ preventScroll: true });
    });

    demoElement.querySelector("[data-action='reset']").addEventListener("click", () => {
      picks = {};
      undoStacks = {};
      selectedPersonId = null;
      render();
    });

    render();
  }

  // ---- "Who it's for" illustrations ------------------------------------------------------------

  const audienceScenes = {
    portrait: [
      { x: 300, y: 190, scale: 1.7, skin: "#c98b62", skinShade: "#b0774f", hair: "#2a1a12", hairStyle: "bun", shirt: "#6c5ce7" },
    ],
    selfie: [
      { x: 245, y: 200, scale: 1.3, tilt: -8, skin: "#f3cfb0", skinShade: "#dfb795", hair: "#d8a24a", hairStyle: "bob", shirt: "#e0475b" },
      { x: 380, y: 210, scale: 1.25, tilt: 6, skin: "#6e4a34", skinShade: "#5c3d2a", hair: "#16100c", hairStyle: "short", shirt: "#2f9e8f" },
    ],
    group: [
      { x: 90, y: 220, scale: 0.78, skin: "#f1c7a3", skinShade: "#ddb08b", hair: "#5a3a22", hairStyle: "short", shirt: "#3b8ea5" },
      { x: 195, y: 195, scale: 0.82, skin: "#8d5a3b", skinShade: "#764a30", hair: "#241812", hairStyle: "curls", shirt: "#f2b134" },
      { x: 300, y: 215, scale: 0.8, skin: "#e2b08a", skinShade: "#cc9a74", hair: "#9aa0a8", hairStyle: "short", shirt: "#e4572e", glasses: true },
      { x: 405, y: 192, scale: 0.84, skin: "#c98b62", skinShade: "#b0774f", hair: "#2a1a12", hairStyle: "bun", shirt: "#6c5ce7" },
      { x: 510, y: 222, scale: 0.78, skin: "#f3cfb0", skinShade: "#dfb795", hair: "#b97a35", hairStyle: "bob", shirt: "#2f9e8f" },
    ],
  };

  function setUpAudienceIllustrations() {
    document.querySelectorAll("[data-scene]").forEach((sceneElement, sceneIndex) => {
      const people = audienceScenes[sceneElement.dataset.scene];
      if (!people) return;
      sceneElement.insertAdjacentHTML("afterbegin", sceneMarkup("0 0 600 400", people, `scene-sky-${sceneIndex}`));
    });
  }

  // ---- Footer year -----------------------------------------------------------------------------

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((yearElement) => {
      yearElement.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const demoElement = document.querySelector("[data-demo]");
    if (demoElement) setUpDemo(demoElement);
    setUpAudienceIllustrations();
    setCurrentYear();
  });
})();
