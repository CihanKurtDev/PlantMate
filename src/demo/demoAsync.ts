export const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export const waitFor = async (
    check: () => boolean,
    timeout = 1200,
    interval = 20
) => {
    const start = Date.now();

    while (Date.now() - start < timeout) {
        if (check()) return true;
        await sleep(interval);
    }

    return false;
};