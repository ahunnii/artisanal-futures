import React, { FC, useEffect, useState } from "react";
import StopsTab from "~/components/tools/routing/stops/stops_tab";
import { ScrollArea } from "~/components/ui/scroll-area";

const TestLayout: FC = ({ children }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100">
        {/* Top Most Bar */}
        <div className="h-16 bg-blue-500">Test</div>
        {/* Rest of the Sidebar */}
        <ScrollArea className="h-full w-full rounded-md border p-4">
          Jokester began sneaking into the castle in the middle of the night and
          leaving jokes all over the place: under the king's pillow, in his
          soup, even in the royal toilet. The king was furious, but he couldn't
          seem to stop Jokester. And then, one day, the people of the kingdom
          discovered that the jokes left by Jokester were so funny that they
          couldn't help but laugh. And once they started laughing, they couldn't
          stop. Jokester began sneaking into the castle in the middle of the
          night and leaving jokes all over the place: under the king's pillow,
          in his soup, even in the royal toilet. The king was furious, but he
          couldn't seem to stop Jokester. And then, one day, the people of the
          kingdom discovered that the jokes left by Jokester were so funny that
          they couldn't help but laugh. And once they started laughing, they
          couldn't stop. Jokester began sneaking into the castle in the middle
          of the night and leaving jokes all over the place: under the king's
          pillow, in his soup, even in the royal toilet. The king was furious,
          but he couldn't seem to stop Jokester. And then, one day, the people
          of the kingdom discovered that the jokes left by Jokester were so
          funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop. Jokester began sneaking into the castle
          in the middle of the night and leaving jokes all over the place: under
          the king's pillow, in his soup, even in the royal toilet. The king was
          furious, but he couldn't seem to stop Jokester. And then, one day, the
          people of the kingdom discovered that the jokes left by Jokester were
          so funny that they couldn't help but laugh. And once they started
          laughing, they couldn't stop.
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="w-3/4 overflow-y-auto">
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-10 bg-white p-4 ${
            hasScrolled ? "shadow-md" : ""
          }`}
        >
          {/* Header content goes here */}
        </div>
        {/* Page Content */}
        <div className="h-full p-4">
          {" "}
          <ScrollArea className="h-full w-full rounded-md border p-4">
            Jokester began sneaking into the castle in the middle of the night
            and leaving jokes all over the place: under the king's pillow, in
            his soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop. Jokester began sneaking into the castle in the
            middle of the night and leaving jokes all over the place: under the
            king's pillow, in his soup, even in the royal toilet. The king was
            furious, but he couldn't seem to stop Jokester. And then, one day,
            the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop. Jokester began sneaking into
            the castle in the middle of the night and leaving jokes all over the
            place: under the king's pillow, in his soup, even in the royal
            toilet. The king was furious, but he couldn't seem to stop Jokester.
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn't help but
            laugh. And once they started laughing, they couldn't stop. Jokester
            began sneaking into the castle in the middle of the night and
            leaving jokes all over the place: under the king's pillow, in his
            soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop. Jokester began sneaking into the castle in the
            middle of the night and leaving jokes all over the place: under the
            king's pillow, in his soup, even in the royal toilet. The king was
            furious, but he couldn't seem to stop Jokester. And then, one day,
            the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop. Jokester began sneaking into
            the castle in the middle of the night and leaving jokes all over the
            place: under the king's pillow, in his soup, even in the royal
            toilet. The king was furious, but he couldn't seem to stop Jokester.
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn't help but
            laugh. And once they started laughing, they couldn't stop. Jokester
            began sneaking into the castle in the middle of the night and
            leaving jokes all over the place: under the king's pillow, in his
            soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop. Jokester began sneaking into the castle in the
            middle of the night and leaving jokes all over the place: under the
            king's pillow, in his soup, even in the royal toilet. The king was
            furious, but he couldn't seem to stop Jokester. And then, one day,
            the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop. Jokester began sneaking into
            the castle in the middle of the night and leaving jokes all over the
            place: under the king's pillow, in his soup, even in the royal
            toilet. The king was furious, but he couldn't seem to stop Jokester.
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn't help but
            laugh. And once they started laughing, they couldn't stop. Jokester
            began sneaking into the castle in the middle of the night and
            leaving jokes all over the place: under the king's pillow, in his
            soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop. Jokester began sneaking into the castle in the
            middle of the night and leaving jokes all over the place: under the
            king's pillow, in his soup, even in the royal toilet. The king was
            furious, but he couldn't seem to stop Jokester. And then, one day,
            the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop. Jokester began sneaking into
            the castle in the middle of the night and leaving jokes all over the
            place: under the king's pillow, in his soup, even in the royal
            toilet. The king was furious, but he couldn't seem to stop Jokester.
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn't help but
            laugh. And once they started laughing, they couldn't stop. Jokester
            began sneaking into the castle in the middle of the night and
            leaving jokes all over the place: under the king's pillow, in his
            soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop. Jokester began sneaking into the castle in the
            middle of the night and leaving jokes all over the place: under the
            king's pillow, in his soup, even in the royal toilet. The king was
            furious, but he couldn't seem to stop Jokester. And then, one day,
            the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop.
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default TestLayout;