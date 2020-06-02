module.exports = {
    disable: true,
    name: "test",
    aliases: ["테스트"],
    args: 0,
    usage: "[args,]",
    description: "명령어 기본 구조입니다.",
    roles: [],
    categories: [],
    channels: [],
    help: false,
    execute(message, args) {
        console.log(`[?] Command template: ${message} | ${args}`);
    },
};
