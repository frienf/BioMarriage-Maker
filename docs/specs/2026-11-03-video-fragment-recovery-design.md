# Video Fragment Recovery Design — Stellar .chk Chunks

Date: 2026-11-03
Author: AI Assistant
Status: Approved

## 1. Goal
Recover readable video fragments from Stellar Data Recovery raw chunks (`.chk` / `.TMP`) in `D:\recover\#Root`, specifically from `FOUND.000` and `.TMP` files.

## 2. Scope
- Target folder: `D:\recover\#Root`
- Target files: `.chk`, `.TMP`, contents of `FOUND.000`
- Output: reconstructed playable video fragments or extraction reports
- Fallback: automated carving (`scalpel`/`foremost`) for unknown/mixed chunks

## 3. Approach (Primary)
Video-specific repair/rebuild using `ffprobe`, `ffmpeg`, `binwalk`, and `untrunc` (for MP4/MOV). Manually extract clearly bounded fragments with `dd` when signatures are obvious.

## 4. Approach (Fallback)
Automated file carving with `scalpel` or `foremost` configured with video signatures (MP4, AVI, MPEG-TS, MOV).

## 5. Tools
- `ffprobe`, `ffmpeg`
- `binwalk`
- `scalpel` / `foremost`
- `untrunc`
- `dd`, `hexdump`
- PowerShell / bash for scripting

## 6. Output
- Reconstructed video files (`.mp4`, `.avi`, `.mov`, `.part`)
- Recovery log at `docs/specs/recovery-log.md` with chunk results

## 7. Success Criteria
- At least one chunk produces a readable/partially playable video fragment
- Log clearly distinguishes successful extractions from failures

## 8. Error Handling
If `ffmpeg` repair fails, fall back to carving. If carving yields nothing, log failure with chunk name and move to next chunk. No destructive edits to original chunks.
