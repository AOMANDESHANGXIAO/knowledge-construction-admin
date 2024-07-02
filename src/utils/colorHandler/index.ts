/**
 * hex转rgb
 * @param {string} str  色值，如：#409EFF
 * @returns rgb数组[64, 158, 255]
 */
const hexToRgb = (str: string): number[] => {
    let hexs = null;
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(str)) return alert("色值不正确");
    str = str.replace("#", ""); // 去掉#
    hexs = str.match(/../g); // 切割成数组 409EFF => ['40','9E','FF']
    // 将切割的色值转换为16进制
    for (let i = 0; i < hexs.length; i++) hexs[i] = parseInt(hexs[i], 16);
    return hexs; // 返回rgb色值[64, 158, 255]
};

/**
 * 颜色减淡
 * @param {string} color  色值，如：##409EFF
 * @param {number} level 调整幅度，0~1之间
 * @returns {array} 最终颜色减淡的rgb数组
 */
const getLightColor = (color: string, level: number): number[] => {
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(color)) return alert("色值不正确");
    let rgb = hexToRgb(color);
    // 循环对色值进行调整
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i]); // 始终保持在0-255之间
    }
    return rgb; // [159, 206, 255]
};
// getLightColor('#409EFF',0.5)

/**
 * 颜色加深
 * @param {string} color  色值，如：##409EFF
 * @param {number} level 调整幅度，0~1之间
 * @returns 最终颜色加深的rgb数组
 */
const getDarkColor = (color: string, level: number) => {
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(color)) return alert("色值不正确");
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] - rgb[i] * level); // 始终保持在0-255之间
    }
    return rgb; // [32, 79, 127]
};

/**
 * rgb转hex
 * @param {number} r 红色色值，如：64
 * @param {number} g 绿色色值，如：158
 * @param {number} b 蓝色色值，如：255
 * @returns 最终rgb转hex的值，如：64,158,255 -> #409EFF
 */
const rgbToHex = (r: number, g: number, b: number): string => {
    let reg = /^\d{1,3}$/; // 限定1-3位 -> 0~255
    if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return alert("色值不正确");
    let hex = [r.toString(16), g.toString(16), b.toString(16)];
    // 转换的值如果只有一位则补0
    for (let i = 0; i < 3; i++) {
        if (hex[i].length === 1) hex[i] = `0${hex[i]}`;
    }
    return `#${hex.join("")}`; // #409eff
};

/**
 *  获取hex加深后的颜色
 * @param color hex颜色
 * @param level 加深的程度
 * @returns string hex颜色
 */

const getHexColorDark = (color: string, level: number) => {
    let rgb = getDarkColor(color, level);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

/**
 *  获取hex变浅后的颜色
 * @param color hex颜色
 * @param level 减少的程度
 * @returns string hex颜色
 */

const getHexColorLight = (color: string, level: number) => {
    let rgb = getLightColor(color, level);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

export {
    hexToRgb,
    getLightColor,
    getDarkColor,
    rgbToHex,
    getHexColorDark,
    getHexColorLight,
};
