import { Card, CardContent } from "@/components/ui/card";

export const PrivacyPolicyPage = () => {
    return (
        <div className="space-y-6 pb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Privacy Policy
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Last Updated: June 2026
                </p>
            </div>

            <Card>
                <CardContent className="pt-6 text-sm text-foreground space-y-6 leading-relaxed">
                    <p>
                        Welcome to Squadify. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
                    </p>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">1. Information We Collect</h2>
                        <p>When you use Squadify, we may collect the following information:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Account Information:</strong> Name, Email address, Profile picture (if provided through Google Sign-In)</li>
                            <li><strong>Trip Information:</strong> Trip names and descriptions, Participant information added to trips, Expense records entered by users, Expense split details and balances</li>
                            <li><strong>Technical Information:</strong> Device type, Browser information, IP address, Usage logs and diagnostics</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Authenticate and identify users</li>
                            <li>Create and manage trips</li>
                            <li>Track and calculate shared expenses</li>
                            <li>Send trip invitations</li>
                            <li>Improve application performance and reliability</li>
                            <li>Provide customer support</li>
                            <li>Detect abuse, fraud, or unauthorized activity</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">3. Data Sharing</h2>
                        <p>We do not sell, rent, or trade your personal information.</p>
                        <p>Information may be shared only in the following situations:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>With participants of trips you join or create</li>
                            <li>When required by law or legal process</li>
                            <li>To protect the security and integrity of Squadify</li>
                            <li>With trusted service providers that help us operate the application</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">4. Data Storage</h2>
                        <p>Your information may be stored using third-party infrastructure providers including:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Firebase Authentication</li>
                            <li>MongoDB</li>
                            <li>Cloud hosting providers</li>
                        </ul>
                        <p>We take reasonable measures to protect your data from unauthorized access, disclosure, or misuse.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">5. Third-Party Services</h2>
                        <p>Squadify may use third-party services that have their own privacy policies, including:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Google Sign-In</li>
                            <li>Firebase</li>
                            <li>MongoDB</li>
                            <li>Hosting and analytics providers</li>
                        </ul>
                        <p>We are not responsible for the privacy practices of third-party services.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">6. Data Retention</h2>
                        <p>We retain your information for as long as your account remains active or as necessary to provide the service.</p>
                        <p>You may request account deletion by contacting us.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">7. Your Rights</h2>
                        <p>Depending on your location, you may have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Access your personal information</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Object to certain uses of your information</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">8. Children's Privacy</h2>
                        <p>Squadify is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. Changes will be posted within the application and become effective upon publication.</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold tracking-tight">10. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="text-primary font-medium">support@squadify.app</p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};
