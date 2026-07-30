from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"
NAVY = "#071a2f"
GOLD = "#ead4a5"
PAGE = "#f3f6f9"
SCALE = 4


def draw_balance(draw, left, top, size, color, stroke):
    cx = left + size * 0.5
    beam_y = top + size * 0.30
    base_y = top + size * 0.82
    arm_left = left + size * 0.20
    arm_right = left + size * 0.80
    pan_y = top + size * 0.64

    draw.line((cx, top + size * 0.13, cx, base_y), fill=color, width=stroke)
    draw.line((arm_left, beam_y, arm_right, beam_y), fill=color, width=stroke)
    draw.line(
        (left + size * 0.30, base_y, left + size * 0.70, base_y),
        fill=color,
        width=stroke,
    )

    for arm_x in (arm_left, arm_right):
        half_pan = size * 0.15
        draw.line(
            (arm_x, beam_y, arm_x - half_pan, pan_y),
            fill=color,
            width=stroke,
        )
        draw.line(
            (arm_x, beam_y, arm_x + half_pan, pan_y),
            fill=color,
            width=stroke,
        )
        draw.line(
            (arm_x - half_pan, pan_y, arm_x + half_pan, pan_y),
            fill=color,
            width=stroke,
        )
        draw.arc(
            (
                arm_x - half_pan,
                pan_y - size * 0.03,
                arm_x + half_pan,
                pan_y + size * 0.19,
            ),
            0,
            180,
            fill=color,
            width=stroke,
        )


def legacy_icon(size, round_icon=False):
    def paint(image, draw, scale):
        edge = size * scale
        radius = edge * (0.5 if round_icon else 0.22)
        draw.rounded_rectangle((0, 0, edge, edge), radius=radius, fill=NAVY)
        draw_balance(
            draw,
            edge * 0.08,
            edge * 0.08,
            edge * 0.84,
            GOLD,
            max(3, round(edge * 0.045)),
        )

    return supersampled(size, paint)


def adaptive_foreground(size):
    def paint(image, draw, scale):
        edge = size * scale
        draw_balance(
            draw,
            edge * 0.22,
            edge * 0.22,
            edge * 0.56,
            GOLD,
            max(3, round(edge * 0.028)),
        )

    return supersampled(size, paint)


def splash(width, height):
    def paint(image, draw, scale):
        full_width = width * scale
        full_height = height * scale
        draw.rectangle((0, 0, full_width, full_height), fill=PAGE)
        tile = min(full_width, full_height) * 0.26
        left = (full_width - tile) / 2
        top = (full_height - tile) / 2
        draw.rounded_rectangle(
            (left, top, left + tile, top + tile),
            radius=tile * 0.23,
            fill=NAVY,
        )
        draw_balance(
            draw,
            left + tile * 0.08,
            top + tile * 0.08,
            tile * 0.84,
            GOLD,
            max(4, round(tile * 0.045)),
        )

    return supersampled((width, height), paint)


def supersampled(dimensions, painter):
    if isinstance(dimensions, tuple):
        width, height = dimensions
    else:
        width = height = dimensions
    image = Image.new(
        "RGBA",
        (width * SCALE, height * SCALE),
        (0, 0, 0, 0),
    )
    painter(image, ImageDraw.Draw(image), SCALE)
    return image.resize((width, height), Image.Resampling.LANCZOS)


icon_sizes = {
    "mdpi": (48, 108),
    "hdpi": (72, 162),
    "xhdpi": (96, 216),
    "xxhdpi": (144, 324),
    "xxxhdpi": (192, 432),
}

for density, (legacy_size, foreground_size) in icon_sizes.items():
    folder = RES / f"mipmap-{density}"
    legacy_icon(legacy_size).save(folder / "ic_launcher.png")
    legacy_icon(legacy_size, round_icon=True).save(folder / "ic_launcher_round.png")
    adaptive_foreground(foreground_size).save(folder / "ic_launcher_foreground.png")

splash_files = {
    "drawable/splash.png": (480, 320),
    "drawable-land-mdpi/splash.png": (480, 320),
    "drawable-land-hdpi/splash.png": (800, 480),
    "drawable-land-xhdpi/splash.png": (1280, 720),
    "drawable-land-xxhdpi/splash.png": (1600, 960),
    "drawable-land-xxxhdpi/splash.png": (1920, 1280),
    "drawable-port-mdpi/splash.png": (320, 480),
    "drawable-port-hdpi/splash.png": (480, 800),
    "drawable-port-xhdpi/splash.png": (720, 1280),
    "drawable-port-xxhdpi/splash.png": (960, 1600),
    "drawable-port-xxxhdpi/splash.png": (1280, 1920),
}

for relative_path, (width, height) in splash_files.items():
    splash(width, height).save(RES / relative_path)

print("Generated Android launcher and splash assets.")
