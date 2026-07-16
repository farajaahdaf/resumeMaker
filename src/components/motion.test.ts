import { createElement } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentEditor } from "@/components/editor-sections";
import { MotionPresence } from "@/components/motion-presence";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { sampleResume, type Resume } from "@/domain/resume";

afterEach(() => {
  vi.useRealTimers();
});

describe("motion interactions", () => {
  it("keeps status content mounted until its exit transition finishes", () => {
    vi.useFakeTimers();
    const view = render(createElement(MotionPresence, { show: true, contentKey: "saved", duration: 180 }, "Tersimpan"));

    act(() => vi.advanceTimersByTime(32));
    expect(screen.getByText("Tersimpan").className).toContain("is-visible");

    view.rerender(createElement(MotionPresence, { show: false, contentKey: "", duration: 180 }, ""));
    act(() => vi.advanceTimersByTime(16));
    expect(screen.getByText("Tersimpan").className).toContain("is-leaving");

    act(() => vi.advanceTimersByTime(180));
    expect(screen.queryByText("Tersimpan")).toBeNull();
  });

  it("animates an added experience in and delays removal until exit completes", () => {
    vi.useFakeTimers();
    let current: Resume = { ...sampleResume, experiences: [] };
    const onChange = vi.fn((next: Resume) => {
      current = next;
    });
    const view = render(createElement(ContentEditor, { resume: current, onChange, onImprove: vi.fn() }));

    fireEvent.click(screen.getByRole("button", { name: /Pengalaman/ }));
    fireEvent.click(screen.getByRole("button", { name: "Tambah pengalaman" }));
    view.rerender(createElement(ContentEditor, { resume: current, onChange, onImprove: vi.fn() }));

    const card = screen.getByText("Pengalaman 1").closest(".entry-card");
    expect(card?.className).toContain("is-entering");

    act(() => vi.advanceTimersByTime(240));
    expect(card?.className).not.toContain("is-entering");

    fireEvent.click(screen.getByRole("button", { name: "Hapus pengalaman" }));
    expect(card?.className).toContain("is-leaving");
    expect(current.experiences).toHaveLength(1);

    act(() => vi.advanceTimersByTime(180));
    view.rerender(createElement(ContentEditor, { resume: current, onChange, onImprove: vi.fn() }));
    expect(current.experiences).toHaveLength(0);
    expect(screen.queryByRole("button", { name: "Hapus pengalaman" })).toBeNull();
  });

  it("crossfades local-save privacy into onboarding progress", () => {
    vi.useFakeTimers();
    render(createElement(OnboardingFlow, { onComplete: vi.fn() }));
    act(() => vi.advanceTimersByTime(32));

    expect(screen.getByText("Local save")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Mulai" }));
    act(() => vi.advanceTimersByTime(32));

    expect(screen.getByText("1 / 7")).not.toBeNull();
    expect(screen.getByText("Local save").closest(".motion-presence")?.className).toContain("is-leaving");

    act(() => vi.advanceTimersByTime(180));
    expect(screen.queryByText("Local save")).toBeNull();
  });
});
