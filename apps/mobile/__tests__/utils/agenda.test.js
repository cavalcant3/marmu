const { formatAgendaDate, isValidTime, localDateKey, parseBrDate, sortAgendaItems } = require("../../src/utils/agenda");

describe("agenda local", () => {
  test("converte datas brasileiras válidas sem depender de UTC", () => {
    expect(parseBrDate("15/08/2026")).toBe("2026-08-15");
    expect(formatAgendaDate("2026-08-15")).toBe("15/08/2026");
    expect(localDateKey(new Date(2026, 7, 1, 23, 59))).toBe("2026-08-01");
  });

  test("rejeita datas e horários impossíveis", () => {
    expect(parseBrDate("31/02/2026")).toBeNull();
    expect(isValidTime("23:59")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("12:60")).toBe(false);
  });

  test("ordena compromissos pela data e pelo horário", () => {
    const items = [
      { id: "2", data: "2026-08-02", hora: "08:00" },
      { id: "1", data: "2026-08-01", hora: "14:00" },
      { id: "0", data: "2026-08-01", hora: "09:00" },
    ];
    expect(sortAgendaItems(items).map((item) => item.id)).toEqual(["0", "1", "2"]);
  });
});
