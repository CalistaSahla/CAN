# CAN Workspace Instructions

## Ponytail

Adapted from [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), licensed under MIT.

Use the smallest solution that fully solves the request. Before adding code, check in order:

1. Is the change necessary?
2. Does the codebase already have a suitable implementation to reuse?
3. Can a platform feature or installed dependency handle it?
4. What is the minimum correct implementation?

Read the affected code and trace its actual flow before choosing an approach. Fix root causes rather than symptoms. Avoid unnecessary abstractions, dependencies, boilerplate, and files. Prefer deleting unneeded code over adding more.

Do not trade away input validation, error handling, security, accessibility, or meaningful verification to reduce code. For non-trivial logic, leave one focused runnable check.

## Anti-slop

For UI work, read `.agents/skills/antislop/SKILL.md` and `.agents/skills/antislop-ui/SKILL.md`. Also load `.agents/skills/antislop-human/SKILL.md` and `.agents/skills/antislop-layoutmobile/SKILL.md` when accessibility or responsive layout is involved. For user-facing copy, read `.agents/skills/antislop-copywriting/SKILL.md` with the core skill.

Apply Anti-slop during implementation and run its Delivery Gate before delivering UI work. Use the existing CAN product identity and interface as design direction; preserve it unless the user asks for a redesign. Do not invent product claims, statistics, testimonials, or destinations. Keep controls functional and verify mobile, keyboard, and UI states.