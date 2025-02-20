export function combineLists(lists) {
  const result = [];

  function recursiveHelper(currIndex, tempList) {
    if (currIndex === lists.length) {
      result.push(tempList.slice());
      return;
    }

    for (let i = 0; i < lists[currIndex].length; i++) {
      tempList.push(lists[currIndex][i]);
      recursiveHelper(currIndex + 1, tempList);
      tempList.pop();
    }
  }

  recursiveHelper(0, []);

  return result;
}

export function normalizeURL(url: string): string {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/")) p.pathname = p.pathname.slice(0, -1);
  if (
    (p.port === "80" && p.protocol === "ws:") ||
    (p.port === "443" && p.protocol === "wss:")
  )
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}

export const uniqByFn = <T>(arr: T[], keyFn: any): T[] => {
  return Object.values(
    arr.reduce((map, item) => {
      const key = keyFn(item);
      if (map[key]) {
        return {
          ...map,
          [key]: map[key].created_at > item.created_at ? map[key] : item,
        };
      }
      return {
        ...map,
        [key]: item,
      };
    }, {})
  );
};
