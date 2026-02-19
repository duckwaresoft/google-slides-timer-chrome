/**
 * DOM Node Tracker Service
 *
 * Responsibility: Track DOM nodes that contain placeholders
 * Single Responsibility Principle: Only handles node tracking
 */
class DOMNodeTracker {
  constructor() {
    this.originalTexts = new Map(); // Store original text for each node
    this.trackedNodes = new Set(); // Set of tracked nodes
  }

  /**
   * Find all text nodes containing placeholders
   * @param {HTMLElement} element - Root element to search
   * @returns {Array<Node>} Array of text nodes with placeholders
   */
  findPlaceholderNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip script and style tags
          if (node.parentElement &&
              (node.parentElement.tagName === 'SCRIPT' ||
               node.parentElement.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT;
          }
          // Only include nodes with placeholder text
          if (node.textContent.match(/<<[^>]+>>/)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    return textNodes;
  }

  /**
   * Track a node (store its original text)
   * @param {Node} node - DOM node to track
   */
  trackNode(node) {
    if (!this.trackedNodes.has(node)) {
      this.trackedNodes.add(node);
      this.originalTexts.set(node, node.textContent);
    }
  }

  /**
   * Get original text for a node
   * @param {Node} node - DOM node
   * @returns {string|null} Original text or null if not tracked
   */
  getOriginalText(node) {
    return this.originalTexts.get(node) || null;
  }

  /**
   * Get all tracked nodes
   * @returns {Array<Node>} Array of tracked nodes
   */
  getTrackedNodes() {
    return Array.from(this.trackedNodes);
  }

  /**
   * Check if node still exists in DOM
   * @param {Node} node - DOM node to check
   * @returns {boolean}
   */
  isNodeInDOM(node) {
    return document.contains(node);
  }

  /**
   * Remove nodes that are no longer in DOM
   * @returns {number} Number of nodes removed
   */
  cleanupStaleNodes() {
    let removed = 0;
    this.trackedNodes.forEach(node => {
      if (!this.isNodeInDOM(node)) {
        this.trackedNodes.delete(node);
        this.originalTexts.delete(node);
        removed++;
      }
    });
    return removed;
  }

  /**
   * Update node text content
   * @param {Node} node - DOM node
   * @param {string} newText - New text content
   */
  updateNodeText(node, newText) {
    if (node.textContent !== newText) {
      node.textContent = newText;
    }
  }

  /**
   * Clear all tracked nodes
   */
  clear() {
    this.trackedNodes.clear();
    this.originalTexts.clear();
  }

  /**
   * Get statistics
   * @returns {Object} Tracking statistics
   */
  getStats() {
    return {
      totalTracked: this.trackedNodes.size,
      inDOM: this.getTrackedNodes().filter(n => this.isNodeInDOM(n)).length
    };
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMNodeTracker;
}
