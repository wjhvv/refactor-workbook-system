import { useState, useCallback } from "react";
import { parseExcel } from "../../services/excel/parser";
import { parseRuleDB } from "../../services/excel/ruleDBParser";
import type { RuleDatabase, PartNumberRule, DescriptionRule } from "../../types/ruleDB";

export function useRuleDB() {
  const [ruleDB, setRuleDB] = useState<RuleDatabase | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [sheetCount, setSheetCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseExcel(file);
      setRuleDB(parseRuleDB(parsed));
      setFileName(file.name);
      setFileSize(file.size);
      setSheetCount(parsed.sheets.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "解析失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRuleDB = useCallback(() => {
    setRuleDB(null);
    setFileName(null);
    setFileSize(null);
    setSheetCount(null);
    setError(null);
  }, []);

  // ── Header fields ─────────────────────────────────────────────────────────

  const addHeaderField = useCallback((name: string) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      if (prev.headerFields.some((f) => f.name.toLowerCase() === name.toLowerCase()))
        return prev;
      return { ...prev, headerFields: [...prev.headerFields, { name, aliases: [] }] };
    });
  }, []);

  // ── Header aliases ────────────────────────────────────────────────────────

  const addAlias = useCallback((fieldIndex: number, alias: string) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      const field = prev.headerFields[fieldIndex];
      if (field.aliases.some((a) => a.toLowerCase() === alias.toLowerCase()))
        return prev;
      const headerFields = prev.headerFields.map((f, i) =>
        i === fieldIndex ? { ...f, aliases: [...f.aliases, alias] } : f,
      );
      return { ...prev, headerFields };
    });
  }, []);

  const removeAlias = useCallback((fieldIndex: number, aliasIndex: number) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      const headerFields = prev.headerFields.map((f, i) =>
        i === fieldIndex
          ? { ...f, aliases: f.aliases.filter((_, j) => j !== aliasIndex) }
          : f,
      );
      return { ...prev, headerFields };
    });
  }, []);

  // ── Part Numbers ──────────────────────────────────────────────────────────

  const addPartNumber = useCallback((rule: PartNumberRule) => {
    setRuleDB((prev) => prev && { ...prev, partNumbers: [...prev.partNumbers, rule] });
  }, []);

  const updatePartNumber = useCallback((index: number, rule: PartNumberRule) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      const partNumbers = prev.partNumbers.map((r, i) => (i === index ? rule : r));
      return { ...prev, partNumbers };
    });
  }, []);

  const deletePartNumber = useCallback((index: number) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      return { ...prev, partNumbers: prev.partNumbers.filter((_, i) => i !== index) };
    });
  }, []);

  // ── Descriptions ──────────────────────────────────────────────────────────

  const addDescription = useCallback((rule: DescriptionRule) => {
    setRuleDB((prev) => prev && { ...prev, descriptions: [...prev.descriptions, rule] });
  }, []);

  const updateDescription = useCallback((index: number, rule: DescriptionRule) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      const descriptions = prev.descriptions.map((r, i) => (i === index ? rule : r));
      return { ...prev, descriptions };
    });
  }, []);

  const deleteDescription = useCallback((index: number) => {
    setRuleDB((prev) => {
      if (!prev) return prev;
      return { ...prev, descriptions: prev.descriptions.filter((_, i) => i !== index) };
    });
  }, []);

  return {
    ruleDB,
    fileName,
    fileSize,
    sheetCount,
    error,
    loading,
    loadFile,
    clearRuleDB,
    addHeaderField,
    addAlias,
    removeAlias,
    addPartNumber,
    updatePartNumber,
    deletePartNumber,
    addDescription,
    updateDescription,
    deleteDescription,
  };
}
