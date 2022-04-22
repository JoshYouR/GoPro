## Basic CLI for extracting gpx data from GoPro Videos
### Installation
Install with `npm -i -g extract-goprogpx`.

Global installation is necessary for the CLI to be used in any directory in the terminal.

### Usage
In terminal shell, use `extract-goprogpx -input [path/to/video-name] -output [path/to/file-name]`.

Alternatively, use `-i` instead of `-input`, `-o` instead of `-output`.
> Don't add the file extension to the `-output` name.

### Credit
- ffmpeg
- fluent-ffmpeg/node-fluent-ffmpeg
- ffprobe
- ScottyFillups/ffprobe-client
- JuanIrache/gopro-telemetry
- yargs/yargs