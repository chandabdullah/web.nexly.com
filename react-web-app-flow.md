# Nexly Web App Flow and Functionality Spec

## 1. Product purpose

The app is a video and audio downloader built around a very fast flow:

1. user provides a link
2. app detects the source platform
3. user chooses a simple preset
4. app resolves the best matching media stream
5. app downloads the file
6. app shows progress, success, or failure feedback

The web version should keep this same experience.

## 2. Main user flows the web app should implement

### A. Normal download flow

This should be the main flow of the web app.

1. User opens the web app.
2. User pastes a video link into the input.
3. App immediately detects the platform from the URL.
4. App shows a small platform badge such as YouTube, Instagram, TikTok, Facebook, X, Pinterest, or generic website.
5. User clicks download.
6. App opens a preset selector.
7. User chooses one of:
   - High video
   - Medium video
   - Low video
   - Audio
8. App resolves available media options for the link.
9. App automatically picks the best real option matching the selected preset.
10. App starts the download.
11. App shows progress and status updates.
12. App shows success or failure result.

### B. Shared-link entry flow

The web version should support prefilled links as much as possible.

This can work through:

- pasted URL
- query parameter such as `?url=...`
- clipboard paste button
- optional PWA share target in supported browsers

Expected flow:

1. User opens the app from a shared link or a prefilled link.
2. App auto-fills the input field.
3. App can optionally open the preset selector immediately.
4. User selects preset.
5. App resolves and downloads.

### C. Quick share style flow

The closest web equivalent is an installed PWA share target, not a normal browser tab.

Expected flow:

1. User shares a link to the installed web app.
2. The app opens directly on a share-target page.
3. Shared URL is extracted.
4. Preset selector opens immediately.
5. User chooses preset.
6. App resolves and starts download.

This should be treated as an enhancement, not the main flow, because browser support is limited.

## 3. Core functionality the web app must provide

### Link input and detection

The web app should:

- accept any pasted URL
- trim and normalize the input
- validate that it is an `http` or `https` URL
- detect the source platform from the host name

Supported detection labels should include:

- YouTube
- Instagram
- Facebook
- TikTok
- X or Twitter
- Pinterest
- generic website

This detection is for UI feedback and routing logic only. It should not be the final source of truth for resolution.

### Preset-based downloading

The user should not need to manually choose complex technical stream options.

The web app should expose only these simple presets:

- High video
- Medium video
- Low video
- Audio

After the user selects a preset, the app should internally map that preset to the most appropriate real stream option.

### Download resolution

The web app should support three types of links:

1. direct media links
2. YouTube links
3. social platform links that need a resolver backend

The app should resolve:

- title
- thumbnail if available
- source label
- list of available media options

Each real media option should contain:

- unique id
- kind: video or audio
- display label
- subtitle
- file name
- total size if available
- final downloadable source or backend reference

### Download execution

After the final option is chosen, the app should:

1. start download using a browser-safe method
2. show progress when technically possible
3. handle success cleanly
4. handle failures cleanly

The best practical implementation is backend-assisted download rather than direct third-party download in the browser.

## 4. Preset selection rules the web app should keep

The preset behavior should stay simple and predictable.

### Audio preset

- prefer the best audio-only stream
- if no separate audio stream exists, use the safest default fallback

### High video preset

- choose the highest quality acceptable video stream

### Medium video preset

- choose a middle-quality acceptable video stream

### Low video preset

- choose the smallest acceptable video stream

### Preferred video option rules

When selecting a video stream, the app should prefer:

1. MP4 with audio
2. any video with audio
3. fail if only incompatible or audio-less options remain and the product does not want silent video

Scoring should use:

- resolution labels such as `1080p`, `720p`, `480p`
- file size if resolution is not available

## 5. Status and progress behavior the web app should implement

The app should always keep the user informed with short, clear status text.

Recommended statuses:

- ready for download
- resolving selected quality
- starting download
- download queued
- downloading `x%`
- download complete
- download failed
- download timed out

### Progress display

The UI should show:

- active preset label
- progress percentage
- downloaded size vs total size when available

If exact byte progress is not available, the app should still show:

- resolving
- starting
- downloading
- complete or failed

## 6. Error handling the web app should implement

The web app should return user-friendly errors for common failures.

Important cases:

- empty input
- invalid URL
- unsupported copied token instead of real public link
- resolver backend unavailable
- resolver backend returned invalid response
- source platform unreachable
- unsupported link
- no matching stream for selected preset
- timed-out download
- blocked browser download

Error messages should be simple and action-oriented.

Examples:

- "Paste a valid video link and try again."
- "Use the original public link from the source app."
- "This video could not be resolved right now."
- "No compatible video with audio is available for this link."
- "The download did not respond in time. Try again."

## 7. Backend responsibilities the web app should rely on

For the web version, backend support is essential if you want reliable real-world behavior.

### The backend should handle

- URL validation
- source platform resolution
- YouTube stream extraction
- social-link resolver logic
- direct media probing
- metadata extraction
- filename sanitization
- returning normalized options
- optional file proxying/streaming for browser-safe download

### Why backend is required

Without backend assistance, browser-only implementation will often fail because of:

- CORS restrictions
- anti-bot protections
- expiring signed URLs
- blocked direct third-party downloads
- missing headers
- inconsistent platform behavior

## 8. Frontend responsibilities in React

The React app should focus on:

- URL input UX
- platform detection display
- preset selector modal
- status and progress UI
- toasts and feedback
- calling resolve/download APIs
- optional share-target entry handling

The frontend should not try to do heavy media extraction directly from third-party platforms.

## 9. Recommended React structure

### Pages

- Home page
- Optional share-target page
- Optional recent-downloads/history page

### Main components

- Link input card
- Platform badge
- Preset selection modal
- Download action button
- Progress/status panel
- Toast system

### Main services/hooks

- URL detection logic
- resolve-download API client
- preset-selection utility
- download starter utility
- progress state manager

## 10. API shape the web app should expect

### Resolve endpoint

The frontend should send a URL to a resolve endpoint.

Request:

```json
{
  "url": "https://example.com/video"
}
```

Response:

```json
{
  "title": "Video title",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "sourceLabel": "YouTube",
  "options": [
    {
      "id": "1080p_mp4",
      "kind": "video",
      "label": "1080p",
      "subtitle": "Video + audio • MP4 • 54.3 MB",
      "fileName": "video.mp4",
      "totalBytes": 56900000
    },
    {
      "id": "audio_best",
      "kind": "audio",
      "label": "128 kbps",
      "subtitle": "Audio only • M4A • 4.2 MB",
      "fileName": "video_audio.m4a",
      "totalBytes": 4400000
    }
  ]
}
```

### Download endpoint

After the frontend selects the final real option, it should call a download endpoint that either:

- streams the file directly from your server
- returns a safe signed download URL

Best practice is server-streamed download so filename control and browser compatibility stay consistent.

## 11. Recommended web download behavior

The best practical download flow is:

1. user submits link
2. frontend calls resolve API
3. frontend selects the correct real option using preset rules
4. frontend requests server download for that option
5. server streams the file with proper headers
6. frontend tracks progress if possible
7. frontend shows completion or failure

This is the most reliable way to match the product behavior on web.

## 12. Browser limitations the product should account for

The web app cannot fully match native mobile behavior in these areas:

- no true Android-style share-sheet activity flow in regular web
- no guaranteed background native downloads like a mobile downloader service
- no direct save-to-gallery behavior like mobile photo libraries
- no guaranteed progress for every browser download method
- no unrestricted client-side extraction from every social platform

Because of this, the web version should optimize for:

- reliable link resolution
- reliable file delivery
- clear user feedback
- optional PWA enhancements where supported

## 13. UX requirements for the web version

The web app should feel fast and minimal.

### Required UX behavior

- input should accept pasted links immediately
- platform detection should update live
- download button should be disabled when input is invalid
- preset selector should be simple and fast
- status messages should change at each major step
- error messages should be understandable
- success state should clearly indicate the file is ready or downloaded

### Recommended UI details

- show detected platform badge under the input
- show title/thumbnail when resolution succeeds
- show preset chosen during download
- show progress percentage and size when available
- use toast notifications for short updates
- keep the main flow possible in a single screen

## 14. Final implementation recommendation

If the goal is to make the web app behave as closely as possible to the current product, the implementation should be:

1. React frontend for UI and state
2. backend APIs for all media resolution
3. same preset-selection behavior as the mobile app
4. backend-assisted download streaming
5. optional PWA share-target support for enhanced sharing flow

That is the cleanest and most reliable way to reproduce the same functionality on the web.

