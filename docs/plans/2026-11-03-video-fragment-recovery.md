# Video Fragment Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover readable video fragments from Stellar `.chk`/`.TMP` chunks in `D:\recover\#Root`.

**Architecture:** Primary approach: video-specific repair (`ffprobe`/`ffmpeg`/`binwalk`/`untrunc`). Fallback: automated carving (`scalpel`/`foremost`). All operations read-only on original chunks.

**Tech Stack:** PowerShell / bash, `ffprobe`, `ffmpeg`, `binwalk`, `scalpel`, `foremost`, `untrunc`, `dd`.

---

## File Structure
- Read-only source: `D:\recover\#Root\*.chk`, `D:\recover\#Root\*.TMP`, `D:\recover\#Root\FOUND.000\`
- Scripts: `scripts/recover-video.ps1` (or `.sh`)
- Logs: `docs/specs/recovery-log.md`
- Output: `recovered/` (new directory, reconstructed fragments)

---

### Task 1: Inspect Chunks & Create Recovery Directory

**Files:**
- Read: `D:\recover\#Root`
- Create: `recovered/`
- Modify: `docs/specs/recovery-log.md`

- [ ] **Step 1: List all `.chk` and `.TMP` files**

```powershell
Get-ChildItem -Path "D:\recover\#Root" -Filter "*.chk" -Recurse
Get-ChildItem -Path "D:\recover\#Root" -Filter "*.TMP" -Recurse
```

- [ ] **Step 2: Create output directory**

```powershell
New-Item -ItemType Directory -Path "recovered" -Force
```

- [ ] **Step 3: Initialize recovery log**

```markdown
# Recovery Log — 2026-11-03
- Chunk inspected:
- Signature found:
- Repair attempted:
- Result:
```

---

### Task 2: Video-Specific Repair (Primary)

**Files:**
- Read: `D:\recover\#Root\*.chk`, `D:\recover\#Root\*.TMP`
- Create: `scripts/recover-video.ps1`
- Modify: `recovered/*.mp4` etc.
- Modify: `docs/specs/recovery-log.md`

- [ ] **Step 1: Detect video signatures with `binwalk`**

```powershell
binwalk "D:\recover\#Root\FOUND.000"
binwalk "D:\recover\#Root\*.TMP" 2>$null
```

Expected output: MP4 (`ftyp`/`moov`), AVI (`RIFF`), or MPEG signatures listed.

- [ ] **Step 2: Run `ffprobe` on chunks with signatures**

```powershell
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,duration -of csv=s=x:p=0 "D:\recover\#Root\FOUND.000\chunk_name"
```

Log result in `docs/specs/recovery-log.md`.

- [ ] **Step 3: Attempt repair with `ffmpeg -c copy`**

```powershell
ffmpeg -i "D:\recover\#Root\FOUND.000\chunk_name" -c copy -bsf:a aac_adtstoasc -y "recovered\chunk_name_repaired.mp4"
```

If input is `.TMP`, copy to temporary working file first (read-only on original preserved).

- [ ] **Step 4: If MP4/MOV repair fails, try `untrunc`**

```bash
untrunc "D:\recover\#Root\FOUND.000\chunk_name" "recovered\reference.mp4"
```

Note: requires a reference video from same source device. If no reference available, skip and log skip reason.

- [ ] **Step 5: Verify output with `ffprobe`**

```powershell
ffprobe -v error -show_format -show_streams "recovered\*" 2>&1 | Out-File -FilePath "recovered\ffprobe-report.txt"
```

- [ ] **Step 6: Log all results**

Update `docs/specs/recovery-log.md` for each chunk: signature, `ffmpeg` result (success/fail), file size, playability note.

---

### Task 3: Fallback — Automated Carving

**Files:**
- Read: `D:\recover\#Root`
- Create: `recovered/carved/`
- Modify: `docs/specs/recovery-log.md`

- [ ] **Step 1: Configure `scalpel` or `foremost` with video signatures**

Create config line (PowerShell):

```powershell
"mp4 y 10000000 ftyp moov mdat"
"avi y 10000000 RIFF AVI LIST"
"mov y 10000000 ftyp moov"
```

- [ ] **Step 2: Run carving on `.chk`/`.TMP` files**

```bash
foremost -i "D:\recover\#Root\FOUND.000" -o "recovered\carved"
# OR
scalpel -o "recovered\carved" "D:\recover\#Root\*.chk"
```

- [ ] **Step 3: Inspect carved output**

```powershell
Get-ChildItem -Path "recovered\carved" -Recurse | Select-Object FullName, Length
```

Log carved file names and sizes to `docs/specs/recovery-log.md`.

- [ ] **Step 4: Verify carved video fragments**

```powershell
ffprobe -v error -show_entries stream=codec_type -of csv=p=0 "recovered\carved\*"
```

Log any readable streams found.

---

### Task 4: Final Review & Commit

**Files:**
- Read: `docs/plans/2026-11-03-video-fragment-recovery.md`
- Read: `docs/specs/recovery-log.md`
- Read: `recovered/`

- [ ] **Step 1: Read complete plan**

Verify all tasks reference exact file paths, no placeholders (`TBD`, `TODO`), exact commands shown.

- [ ] **Step 2: Self-review checklist**

- [ ] Spec coverage: does spec section 3 (primary approach) and 4 (fallback) both have tasks? Yes — Task 2, Task 3.
- [ ] Placeholder scan: no `TBD`, no `TODO` without code.
- [ ] Type/command consistency: `ffmpeg` command syntax consistent across Task 2 steps.

- [ ] **Step 3: Commit plan**

```bash
git add docs/plans/2026-11-03-video-fragment-recovery.md
git commit -m "plan: video fragment recovery from stellar chunks"
```

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-11-03-video-fragment-recovery.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh sub-agent per task using the `subagent` tool, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints

**Which approach?**

