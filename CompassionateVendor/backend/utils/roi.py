class ShelfZone:
    def __init__(self, x1, y1, x2, y2):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2

    def draw(self, frame):
        import cv2
        cv2.rectangle(frame, (self.x1, self.y1), (self.x2, self.y2), (255, 0, 0), 2)
        return frame

    def contains(self, point):
        if point is None:
            return False

        x, y = point
        return self.x1 < x < self.x2 and self.y1 < y < self.y2