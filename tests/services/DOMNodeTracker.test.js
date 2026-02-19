const DOMNodeTracker = require('../../src/services/DOMNodeTracker');

describe('DOMNodeTracker Service', () => {
  let tracker;

  beforeEach(() => {
    tracker = new DOMNodeTracker();
    document.body.innerHTML = '';
  });

  describe('findPlaceholderNodes', () => {
    it('should find text nodes with placeholders', () => {
      const div = document.createElement('div');
      div.textContent = 'Current time: <<time>>';
      document.body.appendChild(div);

      const nodes = tracker.findPlaceholderNodes(document.body);

      expect(nodes.length).toBeGreaterThan(0);
      expect(nodes[0].textContent).toContain('<<time>>');
    });

    it('should not find nodes without placeholders', () => {
      document.body.innerHTML = '<div>No placeholders here</div>';

      const nodes = tracker.findPlaceholderNodes(document.body);

      expect(nodes.length).toBe(0);
    });

    it('should skip script tags', () => {
      document.body.innerHTML = '<script>const time = "<<time>>"</script>';

      const nodes = tracker.findPlaceholderNodes(document.body);

      expect(nodes.length).toBe(0);
    });

    it('should skip style tags', () => {
      document.body.innerHTML = '<style>.class::before { content: "<<time>>"; }</style>';

      const nodes = tracker.findPlaceholderNodes(document.body);

      expect(nodes.length).toBe(0);
    });

    it('should find multiple placeholders in nested elements', () => {
      const container = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'Time: <<time>>';
      const span = document.createElement('span');
      span.textContent = 'Status: <<status>>';
      container.appendChild(p);
      container.appendChild(span);
      document.body.appendChild(container);

      const nodes = tracker.findPlaceholderNodes(document.body);

      expect(nodes.length).toBe(2);
    });
  });

  describe('trackNode', () => {
    it('should track a node and store its original text', () => {
      const node = document.createTextNode('<<time>>');

      tracker.trackNode(node);

      expect(tracker.getTrackedNodes()).toContain(node);
      expect(tracker.getOriginalText(node)).toBe('<<time>>');
    });

    it('should not duplicate tracking', () => {
      const node = document.createTextNode('<<time>>');

      tracker.trackNode(node);
      tracker.trackNode(node); // Track again

      expect(tracker.getTrackedNodes().length).toBe(1);
    });
  });

  describe('getOriginalText', () => {
    it('should return original text for tracked node', () => {
      const node = document.createTextNode('<<time>>');
      tracker.trackNode(node);

      expect(tracker.getOriginalText(node)).toBe('<<time>>');
    });

    it('should return null for untracked node', () => {
      const node = document.createTextNode('<<time>>');

      expect(tracker.getOriginalText(node)).toBeNull();
    });
  });

  describe('getTrackedNodes', () => {
    it('should return all tracked nodes', () => {
      const node1 = document.createTextNode('<<time>>');
      const node2 = document.createTextNode('<<date>>');

      tracker.trackNode(node1);
      tracker.trackNode(node2);

      const nodes = tracker.getTrackedNodes();

      expect(nodes.length).toBe(2);
      expect(nodes).toContain(node1);
      expect(nodes).toContain(node2);
    });

    it('should return empty array when nothing tracked', () => {
      expect(tracker.getTrackedNodes()).toEqual([]);
    });
  });

  describe('isNodeInDOM', () => {
    it('should return true for node in DOM', () => {
      document.body.innerHTML = '<div id="test"><<time>></div>';
      const div = document.getElementById('test');
      const node = div.firstChild;

      expect(tracker.isNodeInDOM(node)).toBe(true);
    });

    it('should return false for node not in DOM', () => {
      const node = document.createTextNode('<<time>>');

      expect(tracker.isNodeInDOM(node)).toBe(false);
    });
  });

  describe('cleanupStaleNodes', () => {
    it('should remove nodes not in DOM', () => {
      const node1 = document.createTextNode('<<time>>');
      const node2 = document.createTextNode('<<date>>');

      document.body.appendChild(node2);

      tracker.trackNode(node1); // Not in DOM
      tracker.trackNode(node2); // In DOM

      const removed = tracker.cleanupStaleNodes();

      expect(removed).toBe(1);
      expect(tracker.getTrackedNodes().length).toBe(1);
      expect(tracker.getTrackedNodes()).toContain(node2);
    });

    it('should return 0 when all nodes are in DOM', () => {
      document.body.innerHTML = '<div id="test"><<time>></div>';
      const div = document.getElementById('test');
      const node = div.firstChild;

      tracker.trackNode(node);

      const removed = tracker.cleanupStaleNodes();

      expect(removed).toBe(0);
      expect(tracker.getTrackedNodes().length).toBe(1);
    });
  });

  describe('updateNodeText', () => {
    it('should update node text content', () => {
      const node = document.createTextNode('<<time>>');

      tracker.updateNodeText(node, '2:30 PM');

      expect(node.textContent).toBe('2:30 PM');
    });

    it('should not update if text is the same', () => {
      const node = document.createTextNode('2:30 PM');
      const spy = jest.spyOn(node, 'textContent', 'set');

      tracker.updateNodeText(node, '2:30 PM');

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear all tracked nodes', () => {
      const node1 = document.createTextNode('<<time>>');
      const node2 = document.createTextNode('<<date>>');

      tracker.trackNode(node1);
      tracker.trackNode(node2);

      tracker.clear();

      expect(tracker.getTrackedNodes()).toEqual([]);
      expect(tracker.getOriginalText(node1)).toBeNull();
      expect(tracker.getOriginalText(node2)).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return tracking statistics', () => {
      const node1 = document.createTextNode('<<time>>');
      const node2 = document.createTextNode('<<date>>');

      document.body.appendChild(node2);

      tracker.trackNode(node1); // Not in DOM
      tracker.trackNode(node2); // In DOM

      const stats = tracker.getStats();

      expect(stats.totalTracked).toBe(2);
      expect(stats.inDOM).toBe(1);
    });
  });
});
