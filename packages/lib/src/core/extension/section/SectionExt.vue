<script setup lang="ts">
	import VividMenuItem from "../../components/VividMenuItem.vue";
	import { injectExtension, useEditorInstance } from "@lib/core/extension/utils/common";
	import { useSection } from "@lib/core/extension";

	const editorInstance = useEditorInstance();
	injectExtension(useSection());
	const html = `
  <section>
  <section
    style="
      margin: 10px auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    "
  >
    <section
      style="width: 62%; box-sizing: border-box; max-width: 62% !important"
    >
      <section
        style="border: 1px solid #dec0a4; padding: 17px; box-sizing: border-box"
      >
        <img
          style="width: 100%; display: inline-block"
          src="https://bcn.135editor.com/files/images/editor_styles/88f84773279bb81eca9534d78d1b47cc.png"
        />
      </section>
      <section
        style="
          font-size: 12px;
          color: #f5a85e;
          text-align: left;
          margin: 15px 0 20px;
        "
      >
        <em>
          <span>-Maillard color scheme</span>
        </em>
      </section>
    </section>
    <section
      style="width: 35%; box-sizing: border-box; max-width: 35% !important"
    >
      <section
        style="
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin: 0 0 30%;
        "
      >
        <section
          style="
            font-size: 16px;
            color: #522011;
            text-align: center;
            z-index: 9;
          "
        >
          <strong>冬日微醺</strong>
        </section>
        <section style="flex-shrink: 0; margin-left: -15px">
          <section
            style="
              width: 30px;
              height: 30px;
              background-color: #f7efdd;
              border-radius: 100%;
              box-sizing: border-box;
            "
          ></section>
        </section>
      </section>
      <section
        style="background-color: #c18455; padding: 7px; box-sizing: border-box"
      >
        <img
          style="width: 100%"
          src="https://bcn.135editor.com/files/images/editor_styles/d8cd00ed909c533708f3b439a08b8dd0.png"
        />
      </section>
    </section>
  </section>
</section>
`;

	function insert() {
		editorInstance.value
			.chain()
			.focus()
			.insertContent(html, {
				parseOptions: {
					preserveWhitespace: false,
				},
			})
			.run();
	}
</script>

<template>
	<vivid-menu-item title="插入模板" icon="shapes-line" :action="insert" />
</template>

<style scoped></style>
