module.exports = {
    disable: false,
    name: "list",
    aliases: ["목록"],
    args: 0,
    usage: ["[시작 번호] [끝 번호]", '<"변경"> <대상> <번호>'],
    description: "학생 목록을 면접 순서대로 보여주거나 면접 순서를 바꿉니다.",
    help: true,
    execute(message, args, state = "") {
        const { prefix } = require("../config.json");
        const {
            getInterviewList,
            changeInterviewListOrder,
        } = require("../index");

        if (args[0] === "변경") {
            if (!args[1] || !args[2]) {
                return message.reply(
                    `명령어 실행에 필요한 인자가 부족합니다!\n` +
                        `사용법: \`${prefix}${this.name} ${this.usage[1]}\``
                );
            }
            args[1] = Number(args[1]) - 1;
            args[2] = Number(args[2]) - 1;

            if (args[1] < 0 || args[2] < 0) {
                return message.reply("순서는 `0`보다 커야 합니다!");
            } else if (
                args[1] >= getInterviewList().length ||
                args[2] >= getInterviewList().length
            ) {
                return message.reply(
                    `"순서는 \`${
                        getInterviewList().length
                    }\`보다 작아야 합니다!"`
                );
            }

            if (args[1] == args[2]) {
                return message.reply(
                    `${args[1]}번 학생은 이미 해당 순서입니다.`
                );
            }

            var min = Math.min(args[1] + 1, args[2] + 1),
                max = Math.max(args[1] + 1, args[2] + 1);
            this.execute(message, [min, max], "before");
            changeInterviewListOrder(args[1], args[2]);
            this.execute(message, [min, max], "after");
        } else {
            var msg = "```\n";
            var start = 0,
                end = getInterviewList().length - 1;

            if (args[0]) {
                args[0] = Number(args[0]);
                if (args[0] > 1) {
                    start = args[0] - 1;
                    msg += "\u22EE\n";
                }

                if (args[1]) {
                    args[1] = Number(args[1]);

                    if (args[0] > args[1]) {
                        return message.reply(
                            "`시작 번호`는 `끝 번호`보다 작아야 합니다!"
                        );
                    } else if (args[1] <= 0) {
                        return message.reply(
                            "`끝 번호`는 `0`보다 커야 합니다!"
                        );
                    }
                    end = args[1] - 1;
                }
            }

            for (let i = start; i < getInterviewList().length; i++) {
                if (i > end) {
                    msg += "\u22EE\n";
                    break;
                }

                msg += `${i + 1 < 10 ? 0 : ""}${i + 1}. ${
                    getInterviewList()[i][0]
                } ${getInterviewList()[i][1]}\n`;
            }

            if (state == "before") msg = "변경 전\n" + msg;
            else if (state == "after") msg = "변경 후\n" + msg;
            message.channel.send(msg + "```");
        }
    },
};
