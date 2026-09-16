import { FlowCanvas, FlowNode, Lane, type FlowEdge } from "./Flow";

/**
 * ConnectIQ's user flows for every group, rebuilt in the Nadiia style from the
 * boxes-and-arrows diagram in Niia's PDF case study: onboarding, then the
 * internal team's setup chain, then the two partner roles. It trails off into
 * the page at the bottom, where only the settings screens remain.
 */

const EDGES: FlowEdge[] = [
  { from: "onboarding", to: "customer" },
  { from: "customer", to: "location" },
  { from: "location", to: "contract" },
  { from: "contract", to: "job" },
  { from: "job", to: "incident" },
  { from: "settings", to: "user-management" },
  { from: "settings", to: "personal-settings" },
  // Runs down the right margin, clear of every box, instead of cutting diagonally across lanes.
  { from: "job", to: "jobs-list", fromSide: "right", toSide: "right" },
  { from: "jobs-list", to: "job-review" },
  { from: "jobs-list", to: "agent-task" },
  { from: "agent-task", to: "agent-incident" },
  { from: "agent-task", to: "agent-submit" },
  { from: "agent-incident", to: "agent-submit" },
  { from: "agent-submit", to: "job-review", fromSide: "right", toSide: "left" },
];

export default function ConnectIQUserFlow() {
  return (
    <FlowCanvas edges={EDGES} fade>
      <div className="flex flex-col gap-10">
        <Lane label="User onboarding" className="md:max-w-xs">
          <FlowNode id="onboarding" start bullets={["Email", "Password", "User role"]} />
        </Lane>

        <Lane label="Internal users" tone="green">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-4 md:gap-4">
            <FlowNode
              id="customer"
              start
              title="Add customer + list"
              note="Brand owner, brand, store, country"
            />
            <FlowNode id="location" title="Add locations + list" />
            <FlowNode
              id="contract"
              title="Add contract + list"
              note="Subscriptions per service or product"
            />
            <FlowNode id="job" title="Create jobs + list" note="Job type, partner, schedule" />

            <FlowNode id="inventory" title="Inventory list" className="md:mt-6" />
            <FlowNode id="partners" title="Partners list" className="md:mt-6" />
            <FlowNode id="settings" title="General settings" className="md:mt-6" />
            <FlowNode id="incident" title="Create incident report" tone="orange" className="md:mt-6" />

            <FlowNode
              id="personal-settings"
              title="Personal settings"
              className="md:col-start-2 md:mt-6"
            />
            <FlowNode id="user-management" title="User management" className="md:mt-6" />
          </div>
        </Lane>

        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          <Lane label="Partners: field service agents" tone="orange">
            <div className="flex flex-col gap-7 md:gap-4">
              <FlowNode
                id="agent-task"
                start
                bullets={["Start a job", "Fill in the details", "Add photos"]}
              />
              {/* Wider gap on desktop so the incident → submit arrow has room to read. */}
              <div className="grid grid-cols-1 gap-7 md:mt-4 md:grid-cols-2 md:gap-10">
                <FlowNode id="agent-incident" title="Create incident report" tone="orange" />
                <FlowNode id="agent-submit" title="Submit" tone="green" />
              </div>
              <FlowNode id="agent-personal-settings" title="Personal settings" className="md:mt-4" />
            </div>
          </Lane>

          <Lane label="Partners: dispatch managers" tone="orange">
            <div className="flex flex-col gap-7 md:gap-4">
              <FlowNode id="jobs-list" start title="Jobs list" />
              <FlowNode id="job-review" title="Job review" className="md:mt-4" />
              <FlowNode id="dispatch-user-management" title="User management" />
              <FlowNode id="dispatch-personal-settings" title="Personal settings" />
            </div>
          </Lane>
        </div>
      </div>
    </FlowCanvas>
  );
}
