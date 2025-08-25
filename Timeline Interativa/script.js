document.addEventListener("DOMContentLoaded", () => {
  const timelineContainer = document.querySelector(".timeline-container")
  const scrollLeftBtn = document.getElementById("scroll-left")
  const scrollRightBtn = document.getElementById("scroll-right")
  const SCROLL_AMOUNT = 300

  function scrollTimeline(direction) {
    timelineContainer.scrollBy({
      left: direction * SCROLL_AMOUNT,
      behavior: "smooth",
    })
    updateScrollButtonsVisibility()
  }

  function updateScrollButtonsVisibility() {
    const hasScroll = timelineContainer.scrollWidth > timelineContainer.clientWidth

    if (!hasScroll) {
      scrollLeftBtn.disabled = true
      scrollRightBtn.disabled = true
      scrollLeftBtn.style.opacity = "0.5"
      scrollRightBtn.style.opacity = "0.5"
      return
    }

    if (timelineContainer.scrollLeft <= 0) {
      scrollLeftBtn.disabled = true
      scrollLeftBtn.style.opacity = "0.5"
    } else {
      scrollLeftBtn.disabled = false
      scrollLeftBtn.style.opacity = "1"
    }

    if (timelineContainer.scrollLeft + timelineContainer.clientWidth >= timelineContainer.scrollWidth - 1) {
      scrollRightBtn.disabled = true
      scrollRightBtn.style.opacity = "0.5"
    } else {
      scrollRightBtn.disabled = false
      scrollRightBtn.style.opacity = "1"
    }
  }

  scrollLeftBtn.addEventListener("click", () => scrollTimeline(-1))
  scrollRightBtn.addEventListener("click", () => scrollTimeline(1))

  timelineContainer.addEventListener("scroll", updateScrollButtonsVisibility)

  updateScrollButtonsVisibility()

  window.addEventListener("resize", updateScrollButtonsVisibility)
})
